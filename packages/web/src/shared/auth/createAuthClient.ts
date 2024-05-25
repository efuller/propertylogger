import { createAuth0Client } from '@auth0/auth0-spa-js';
import { MockAuth0Adapter } from './mockAuth0Adapter.ts';

export async function createAuthClient<T>(context: 'test' | 'production' = 'production') {
  let client: unknown;

  if (context === 'test') {
    client = new MockAuth0Adapter();
  } else {
    client = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      authorizationParams: {
        redirect_uri: `${window.location.origin}/logging-in`,
        audience: process.env.AUTH0_AUDIENCE || '',
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    });
  }

  return client as T;
}