import { Auth0Client } from '@auth0/auth0-spa-js';
import { AuthClient } from '../authClient.ts';

export class Auth0AuthClientAdapter implements AuthClient {
  constructor(private auth0Client: Auth0Client) {
    this.auth0Client = auth0Client;
  }

  public async login(): Promise<void> {
    await this.auth0Client.loginWithRedirect();
  }

  public async logout(): Promise<void> {
    await this.auth0Client.logout();
  }

  public async handleRedirectCallback(): Promise<void> {
    await this.auth0Client.handleRedirectCallback();
  }

  public async getToken(): Promise<string> {
    return await this.auth0Client.getTokenSilently();
  }

  public async isAuthenticated(): Promise<boolean> {
    return this.auth0Client.isAuthenticated();
  }

  public async checkSession(): Promise<void> {
    await this.auth0Client.checkSession();
  }

  public async getUser(): Promise<Record<string, never> | undefined> {
    return await this.auth0Client.getUser();
  }
}
