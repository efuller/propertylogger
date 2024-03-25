export interface AuthApi {
  isAuthenticated(): Promise<boolean>;
  login(): Promise<boolean>;
}

export class FakeAuthApi implements AuthApi {
  async isAuthenticated() {
    console.log('isAuthenticated');
    return false;
  }

  async login() {
    return true;
  }
}

