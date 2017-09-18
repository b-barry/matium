import medium from 'medium-sdk';

export const getMediumClient = (token) => {
  const client = new medium.MediumClient({
    clientId: token,
    clientSecret: token
  });

  client.setAccessToken(token);

  return client;
};