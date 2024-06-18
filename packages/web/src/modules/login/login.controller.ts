import { AuthController } from '../auth/auth.controller.ts';
import { LoginRepo } from './login.repo.ts';

export class LoginController {
  constructor(
    private authController: AuthController,
    private loginRepo: LoginRepo,
  ) {}

  public async check() {
    this.loginRepo.setRedirectTo('/');
  }
}