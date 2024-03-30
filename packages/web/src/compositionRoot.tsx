import { AuthRepo } from './modules/auth/auth.repo.ts';
import { AuthPresenter } from './modules/auth/auth.presenter.ts';
import { AuthController } from './modules/auth/auth.controller.ts';
import { AppRouter } from './shared/router';
import { JournalRepo } from './modules/jounals/journal.repo.ts';
import { JournalPresenter } from './modules/jounals/journal.presenter.ts';
import { ApiClient } from './shared/apiClient/apiClient.ts';
import { JournalController } from './modules/jounals/journal.controller.ts';
import { Auth0Adapter, AuthClient } from './modules/auth/AuthClient.ts';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

export class CompositionRoot {
  router: AppRouter | undefined;
  private authPresenter: AuthPresenter | undefined;
  private authController: AuthController | undefined;
  private authRepo: AuthRepo | undefined;
  private journalRepo: JournalRepo | undefined;
  private journalPresenter: JournalPresenter | undefined;
  private journalController: JournalController | undefined;
  private apiClient: ApiClient | undefined;
  private authClient: AuthClient | Auth0Client | undefined;

  async create() {
    const result = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      authorizationParams: {
        redirect_uri: `${window.location.origin}/logging-in`,
        audience: process.env.AUTH0_AUDIENCE || '',
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    })
    // .then((authClient) => {
      this.authClient = new Auth0Adapter(result);
      this.authRepo = new AuthRepo(this.authClient);
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
      return true;
    // });
  }

  getRouter(): AppRouter {
    if (!this.router) {
      throw new Error('Router not set up');
    }
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
    if (!this.authRepo) {
      throw new Error('Auth repo not set up');
    }
    this.authRepo.authenticated = true;
  }
}

const compositionRoot: CompositionRoot = new CompositionRoot();

async function createCompositionRoot() {
  const result = await compositionRoot.create();
  return result;
}
// !async function(){
//   await compositionRoot.create();
// }();

export { compositionRoot, createCompositionRoot };
