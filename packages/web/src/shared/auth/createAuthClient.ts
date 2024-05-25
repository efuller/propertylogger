import { createAuth0Client } from '@auth0/auth0-spa-js';

export async function createAuthClient() {
  const client = await createAuth0Client({
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_CLIENT_ID || '',
    authorizationParams: {
      redirect_uri: `${window.location.origin}/logging-in`,
      audience: process.env.AUTH0_AUDIENCE || '',
      scope: 'openid profile email',
    },
    cacheLocation: 'localstorage',
  });

  return client;
}