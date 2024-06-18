import { AuthClient } from '../authClient.ts';

export class MockAuthClientAdapter implements AuthClient {
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

  public async getUser(): Promise<Record<string, never>> {
    return {};
  }
}
