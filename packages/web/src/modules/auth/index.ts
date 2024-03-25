import { AuthPresenter } from './auth.presenter.ts';
import { AuthController } from './auth.controller.ts';

export class AuthModule {
  constructor(
    private authPresenter: AuthPresenter,
    private authController: AuthController,
  ) {}

  getPresenter() {
    return this.authPresenter;
  }

  getController() {
    return this.authController;
  }
}

