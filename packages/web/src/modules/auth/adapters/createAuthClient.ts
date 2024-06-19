import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { MockAuthClientAdapter } from './mockAuthClientAdapter.ts';
import { AuthClient } from '../authClient.ts';
import { Auth0AuthClientAdapter } from './auth0AuthClientAdapter.ts';

export async function createAuthClient(context: 'test' | 'production' = 'production') {
  let client: unknown;

  if (context === 'test') {
    client = new MockAuthClientAdapter();
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
    client = new Auth0AuthClientAdapter(client as Auth0Client)
  }

  return client as AuthClient;
}