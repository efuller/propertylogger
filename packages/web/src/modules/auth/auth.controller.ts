import { AuthRepo } from './auth.repo.ts';

export class AuthController {
  constructor(private authRepo: AuthRepo) {}

  async login() {
    await this.authRepo.login();
  }
}

