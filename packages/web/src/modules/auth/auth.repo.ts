import { action, makeObservable, observable } from 'mobx';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export class AuthRepo {
  public auth0: Auth0Client | null;

  constructor() {
    makeObservable(this, {
      auth0: observable,
      isAuthenticated: action,
      login: action,
      initialize: action,
    });
    this.auth0 = null;
  }

  public async isAuthenticated() {
    if (!this.auth0) {
      await this.initialize();
      await this.refreshSession();
    }

    const result = await this.auth0?.isAuthenticated();
    return result;
  }

  public async login() {
    console.log('logging in', this.auth0);
    await this.auth0?.loginWithRedirect();
  }

  public async logout() {
    await this.auth0?.logout();
  }

  public async initialize() {
    this.auth0 = await createAuth0Client({
      domain,
      clientId,
      authorizationParams: {
        redirect_uri: `${window.location.origin}/logging-in`,
        audience,
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    });
  }

  public async handleRedirectCallback() {
    try {
      await this.auth0?.handleRedirectCallback();
      await this.auth0?.isAuthenticated();
    } catch (error) {
      throw new Error('Error handling redirect callback');
    }
  }

  public async refreshSession() {
    await this.auth0?.checkSession();
  }

  public async getToken() {
    const token = await this.auth0?.getTokenSilently();
    return token;
  }
}

