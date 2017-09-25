import Github from 'github-base';
import Promise from 'bluebird';
import {error, success} from './output.format';

export const getClient = token => {
  const instance = new Github({
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

export const getGistLink = (gist = {}) => {
  return `https://gist.github.com/${gist.owner.login}/${gist.id}`;
};

export const getGistIdFromGistLink = (link = '') => {
  return link.split('https://gist.github.com/')[1].split('/')[1];
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

export const createGistLinkFromCodeBlock = (alias, gistClient) => async (
  block,
  index
) => {
  const opts = getCreateGistOptions(alias, index, block);

  const gist = await createGist(gistClient, opts);
  const link = getGistLink(gist);

  return {
    ...block,
    link
  };
};

export const deleteGist = async (client, id) => {
  try {
    await client.delAsync(`/gists/${id}`);
    console.log(success(`deleting gist ${id} \n `));
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while deleting gist ${id}: 
        ${err.message}
        \n `
      )
    );
  }
};
