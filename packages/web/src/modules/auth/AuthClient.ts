import { Auth0Client } from '@auth0/auth0-spa-js';
export interface AuthClient {
  initializeClient(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  handleRedirectCallback(): Promise<void>;
  getToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
  checkSession(): Promise<void>;
}

export class Auth0Adapter implements AuthClient {
  constructor(private auth0Client: Auth0Client) {
    this.auth0Client = auth0Client;
  }

  public async initializeClient(): Promise<void> {
    return;
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
}

export class MockAuthClient implements AuthClient {
  public async initializeClient(): Promise<void> {
    return;
  }

  public async login(): Promise<void> {
    return;
  }

  public async logout(): Promise<void> {
    return;
  }

  public async handleRedirectCallback(): Promise<void> {
    return;
  }

  public async getToken(): Promise<string> {
    return 'mock-token';
  }

  public async isAuthenticated(): Promise<boolean> {
    return true;
  }

  public async checkSession(): Promise<void> {
    return Promise.resolve(undefined);
  }
}