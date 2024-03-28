export interface AuthClient {
  initializeClient(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  handleRedirectCallback(): Promise<void>;
  refreshSession(): Promise<void>;
  getToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
  loginWithRedirect(): Promise<boolean>;
  checkSession(): Promise<void>;
  getTokenSilently(): Promise<string>;
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

  public async refreshSession(): Promise<void> {
    return;
  }

  public async getToken(): Promise<string> {
    return 'mock-token';
  }

  public async isAuthenticated(): Promise<boolean> {
    return true;
  }

  public async loginWithRedirect(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async checkSession(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async getTokenSilently(): Promise<string> {
    return Promise.resolve('');
  }
}