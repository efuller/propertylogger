import { AuthRepo } from './auth.repo.ts';

export class AuthController {
  constructor(private authRepo: AuthRepo) {}

  authInitialized() {
    return !!this.authRepo.authClient
  }

  handleRedirectCallback() {
    return this.authRepo.handleRedirectCallback();
  }

  async isAuthenticated() {
    return await this.authRepo.isAuthenticated();
  }

  async login() {
    await this.authRepo.login();
  }

  async logout() {
    await this.authRepo.logout();
  }

  async getToken() {
    return await this.authRepo.getToken();
  }
}

export const MockAuthController = {
  getToken: () => 'mock-token',
}

