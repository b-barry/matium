import Gists from 'gists';
import Promise from 'bluebird';
import {error} from './output.format';

export const getClient = token => {
  const instance = new Gists({
    token
  });

  Promise.promisifyAll(instance);

  return instance;
};

export const getCreateGistOptions = (alias, index, {code, lang}) => {
  const fileName = `matium-${alias}-${index}.${lang}`;
  return {
    files: {
      [fileName]: {
        content: code
      }
    }
  };
};

export const createGistLink = (gist = {}) => {
  return `https://gist.github.com/${gist.owner.login}/${gist.id}`;
};

export const createGist = async (client, data) => {
  try {
    return await client.requestAsync('POST', '/gists', data);
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while creating gist : 
        ${err.message}
        \n `
      )
    );
  }
};

export const createGistLinkFromCodeBlock = (alias, gistClient) => async (block,
                                                                         index) => {
  const opts = getCreateGistOptions(alias, index, block);

  const gist = await createGist(gistClient, opts);
  const link = createGistLink(gist);

  return {
    ...block,
    link
  };
};
