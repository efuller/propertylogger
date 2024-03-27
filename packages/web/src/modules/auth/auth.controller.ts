import { AuthRepo } from './auth.repo.ts';

export class AuthController {
  constructor(private authRepo: AuthRepo) {}

  authInitialized() {
    return !!this.authRepo.auth0;
  }

  handleRedirectCallback() {
    return this.authRepo.handleRedirectCallback();
  }

  async initializeAuth() {
    await this.authRepo.initialize();
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

  async refreshSession() {
    return await this.authRepo.refreshSession();
  }
}

