import medium from 'medium-sdk';
import Promise from 'bluebird';
import {error, info} from './output.format';

Promise.promisifyAll(medium);

export const getClient = token => {
  const client = new medium.MediumClient({
    clientId: token,
    clientSecret: token
  });

  client.setAccessToken(token);

  return client;
};

export const createPostOptions = (userId, {content, options}) => {
  return Object.assign(
    {},
    {userId},
    {content},
    {options},
    {
      contentFormat: 'markdown',
      publishStatus: 'draft'
    }
  );
};

export const createPost = async (client, data) => {
  const {options, userId} = data;

  console.log(info(`Creating medium post => "${options.title}" \n`));

  try {
    if (options.publication) {
      const publications = await client.getPublicationsForUserAsync({userId});

      const pub = publications.find(({name}) => {
        return name.toLowerCase() === options.publication.toLowerCase();
      });

      if (!pub) {
        throw new Error('No publication by that name!');
      }
      return await client.createPostInPublicationAsync(
        Object.assign(data, {publicationId: pub.id})
      );
    }
    return await client.createPostAsync(data);
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while creating post "${options.title}": 
        ${err.message}
        \n `
      )
    );
    return null;
  }
};
