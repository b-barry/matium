import {error, newLine, table} from './utils/output.format';
import {pathExists} from 'fs-extra';
import {humanizePath} from './utils/path';
import getTitle from 'get-md-title';
import Matter from 'gray-matter';
import fs from 'fs';

export const checkLicense = (license) => {
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
    const filesExists = await Promise.all(filesPath.map(async (path) => {
      const exists = await pathExists(path);
      return {path, exists};
    }));

    filesProcessed = filesExists.filter(el => el.exists).map(el => el.path);
    filesNotProcessed = filesExists.filter(el => !el.exists).map(el => el.path);
  }
  catch (err) {
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
    filesProcessed.map(path => [humanizePath(path), 'TRUE', ''])
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
    license: checkLicense(options.license) ? options.license : '',
  }
};

export const parseFilesMatter = (filesPath = []) => {
  return filesPath.map(async (path) => {
    const {data, content: contentWithoutMatter} = Matter(fs.readFileSync(path, 'utf8'));

    const options = setDefaultOptionsMatter(contentWithoutMatter, data);
    const canonicalContent = options.canonicalUrl.length
      ? ` *Cross-posted from [${canonicalUrl}](${canonicalUrl}).*`
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
      content,
    }
  });
};
