import { redirect, RouteObject } from 'react-router-dom';
import { AuthApi, FakeAuthApi } from './modules/auth/auth.api.ts';
import { AuthModule } from './modules/auth';
import { AuthRepo } from './modules/auth/auth.repo.ts';
import { AuthPresenter } from './modules/auth/auth.presenter.ts';
import { AuthController } from './modules/auth/auth.controller.ts';
import { AppRouter } from './shared/router';

export class CompositionRoot {
  router: AppRouter;
  authModule: AuthModule;

  constructor() {
    this.router = new AppRouter(new FakeAuthApi());

    const authRepo = new AuthRepo(new FakeAuthApi());
    this.authModule = new AuthModule(
      new AuthPresenter(authRepo),
      new AuthController(authRepo),
    );
  }

  getRouter(): AppRouter {
    return this.router;
  }

  getAuthModule(): AuthModule {
    return this.authModule;
  }
}

