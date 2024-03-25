import { action, makeObservable, observable } from 'mobx';
import { AuthApi } from './auth.api.ts';

export class AuthRepo {
  public isAuthenticated: boolean;

  constructor(private authApi: AuthApi) {
    makeObservable(this, {
      isAuthenticated: observable,
      getIsAuthenticated: action,
      login: action,
    });
    this.isAuthenticated = false;
  }

  public async getIsAuthenticated() {
    return await this.authApi.isAuthenticated();
  }

  public async login() {
    await this.authApi.login();
    this.isAuthenticated = true;
  }
}

