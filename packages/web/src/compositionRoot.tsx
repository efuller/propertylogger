import { AuthRepo } from './modules/auth/auth.repo.ts';
import { AuthPresenter } from './modules/auth/auth.presenter.ts';
import { AuthController } from './modules/auth/auth.controller.ts';
import { AppRouter } from './shared/router';

class CompositionRoot {
  router: AppRouter;
  private readonly authPresenter: AuthPresenter;
  private readonly authController: AuthController;
  private readonly authRepo: AuthRepo;

  constructor() {
    this.authRepo = new AuthRepo();
    this.authController = new AuthController(this.authRepo);
    this.authPresenter = new AuthPresenter(this.authRepo);
    this.router = new AppRouter(this.authController);
  }

  getRouter(): AppRouter {
    return this.router;
  }

  getAuthModule() {
    return {
      presenter: this.authPresenter,
      controller: this.authController,
    }
  }
}

const compositionRoot = new CompositionRoot();

export { compositionRoot };
