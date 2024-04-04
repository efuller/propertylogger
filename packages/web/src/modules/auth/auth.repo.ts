import { action, makeObservable, observable } from 'mobx';
import { AuthClient } from './authClient.ts';

export class AuthRepo {
  public authClient: AuthClient | null;
  public authenticated: boolean = false;

  constructor(authClient: AuthClient) {
    makeObservable(this, {
      authClient: observable,
      authenticated: observable,
      isAuthenticated: action,
      login: action,
    });
    this.authClient = authClient;
  }

  public async isAuthenticated() {
    if (!this.authClient) {
      await this.refreshSession();
    }

    const result = await this.authClient?.isAuthenticated();
    this.authenticated = !!result;
    return this.authenticated;
  }

  public async login() {
    await this.authClient?.login();
  }

  public async logout() {
    await this.authClient?.logout();
  }

  public async handleRedirectCallback() {
    try {
      await this.authClient?.handleRedirectCallback();
      await this.authClient?.isAuthenticated();
    } catch (error) {
      throw new Error('Error handling redirect callback');
    }
  }

  public async refreshSession() {
    await this.authClient?.checkSession();
  }

  public async getToken() {
    const token = await this.authClient?.getToken();
    return token;
  }
}

