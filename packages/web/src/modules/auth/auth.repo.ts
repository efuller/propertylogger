import { action, makeObservable, observable } from 'mobx';
import { AuthService } from './auth.service.ts';

export class AuthRepo {
  public authService: AuthService;
  public authenticated: boolean = false;

  constructor(authService: AuthService) {
    makeObservable(this, {
      authenticated: observable,
      isAuthenticated: action,
      login: action,
    });
    this.authService = authService;
  }

  public async isAuthenticated() {
    if (!this.authService) {
      await this.refreshSession();
    }

    const result = await this.authService.authClient.isAuthenticated();
    this.authenticated = !!result;
    return this.authenticated;
  }

  public async login() {
    await this.authService.authClient.login();
  }

  public async logout() {
    await this.authService.authClient.logout();
  }

  public async handleRedirectCallback() {
    try {
      await this.authService.authClient.handleRedirectCallback();
      await this.authService.authClient.isAuthenticated();
    } catch (error) {
      throw new Error('Error handling redirect callback');
    }
  }

  public async refreshSession() {
    await this.authService.authClient.checkSession();
  }

  public async getToken() {
    return this.authService.authClient.getToken();
  }

  public async getUser() {
    return this.authService.authClient.getUser();
  }
}

