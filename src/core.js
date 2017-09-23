import {error, newLine, table} from './utils/output.format';
import {pathExists} from 'fs-extra';
import {humanizePath} from './utils/path';
import getTitle from 'get-md-title';
import Matter from 'gray-matter';
import fs from 'fs';
import exit from './utils/exit';
import {injectBlocksLink, parseBlocks} from './utils/extract-gfm';
import {info} from 'eslint';
import {createGistLinkFromCodeBlock} from './utils/gist';
import {createPost, createPostOptions} from './utils/medium';

export const checkLicense = license => {
  if (!license) {
    return false;
  }

  const validLicenses = [
    'all-rights-reserved',
    'cc-40-by',
    'cc-40-by-nd',
    'cc-40-by-sa',
    'cc-40-by-nc',
    'cc-40-by-nc-nd',
    'cc-40-by-nc-sa',
    'cc-40-zero',
    'public-domain'
  ];

  return validLicenses.includes(license);
};

export const getFilesToProcess = async (filesPath = []) => {
  let filesProcessed = [];
  let filesNotProcessed = [];

  try {
    const filesExists = await Promise.all(
      filesPath.map(async path => {
        const exists = await pathExists(path);
        return {path, exists};
      })
    );

    filesProcessed = filesExists.filter(el => el.exists).map(el => el.path);
    filesNotProcessed = filesExists.filter(el => !el.exists).map(el => el.path);
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while checking if all path files exist : 
        ${err.message}
        \n `
      )
    );
    await exit(1);
  }

  table(
    ['Path', 'Will be processed', 'Will not be processed'],
    filesProcessed
      .map(path => [humanizePath(path), 'TRUE', ''])
      .concat(filesNotProcessed.map(path => [humanizePath(path), '', 'TRUE'])),
    [5, 5]
  );

  newLine();

  return filesProcessed;
};

export const setDefaultOptionsMatter = (content, options = {}) => {
  return {
    title: options.title || getTitle(content).text,
    tags: options.tags || [],
    publication: options.publication || '',
    canonicalUrl: options.canonicalUrl || '',
    license: checkLicense(options.license) ? options.license : ''
  };
};

export const parseFilesMatter = (filesPath = []) => {
  return filesPath.map(async path => {
    const {data, content: contentWithoutMatter} = Matter(
      fs.readFileSync(path, 'utf8')
    );

    const options = setDefaultOptionsMatter(contentWithoutMatter, data);
    const canonicalContent = options.canonicalUrl.length
      ? ` *Cross-posted from [${options.canonicalUrl}](${options.canonicalUrl}).*`
      : '';

    const content = `
      # ${options.title}
      
      ${contentWithoutMatter}
      
      ${canonicalContent}
    `;
    return {
      path,
      contentWithoutMatter,
      options,
      contentWithCodeBlock: content,
      content
    };
  });
};

export const parseCodeBlockAndCreateGistFromContent = (
  alias,
  gistClient
) => async post => {
  try {
    console.log(info(`Extracting code blocks \n`));
    const {text, blocks} = parseBlocks(post.contentWithCodeBlock);

    console.log(info(`Creating gist from code blocks \n`));
    const blocksWithLink = await Promise.all(
      blocks.map(createGistLinkFromCodeBlock(alias, gistClient))
    );

    console.log(info(`Replacing code block by gist link \n`));
    const content = injectBlocksLink(text, blocksWithLink);

    return {
      ...post,
      content
    };
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while parsing code blocks and creating gist for
         the post ${post.options.title} : 
        ${err.message}`
      )
    );
    return null;
  }
};

export const createAllMediumPost = (mediumClient, mediumUser) => (
  posts = []
) => {
  return posts
    .map(post => {
      const postOptions = createPostOptions(mediumUser.id, post);
      return createPost(mediumClient, postOptions);
    })
    .filter(post => !!post);
};
