import { AuthRepo } from './modules/auth/auth.repo.ts';
import { AuthPresenter } from './modules/auth/auth.presenter.ts';
import { AuthController } from './modules/auth/auth.controller.ts';
import { AppRouter } from './shared/router';
import { JournalRepo } from './modules/jounals/journal.repo.ts';
import { JournalPresenter } from './modules/jounals/journal.presenter.ts';
import { ApiClient } from './shared/apiClient/apiClient.ts';
import { JournalController } from './modules/jounals/journal.controller.ts';
import { MockAuthClient } from './modules/auth/AuthClient.ts';

export class CompositionRoot {
  router: AppRouter;
  private readonly authPresenter: AuthPresenter;
  private readonly authController: AuthController;
  private readonly authRepo: AuthRepo;
  private readonly journalRepo: JournalRepo;
  private readonly journalPresenter: JournalPresenter;
  private readonly journalController: JournalController;
  private readonly apiClient: ApiClient;


  constructor() {
    this.authRepo = new AuthRepo(new MockAuthClient());
    this.authController = new AuthController(this.authRepo);
    this.authPresenter = new AuthPresenter(this.authRepo);
    this.apiClient = new ApiClient(
      'http://localhost:3000',
      this.authController
    );

    this.journalRepo = new JournalRepo(this.apiClient);
    this.journalController = new JournalController(this.journalRepo);
    this.journalPresenter = new JournalPresenter(this.journalRepo);
    this.router = new AppRouter(this.authController, this.getJournalModule());
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

  getJournalModule() {
    return {
      presenter: this.journalPresenter,
      controller: this.journalController,
    }
  }

  setAsLoggedIn() {
    this.authRepo.authenticated = true;
  }
}

const compositionRoot = new CompositionRoot();

export { compositionRoot };
