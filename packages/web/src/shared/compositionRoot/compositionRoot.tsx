import { AuthRepo } from '../../modules/auth/auth.repo.ts';
import { AuthPresenter } from '../../modules/auth/auth.presenter.ts';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { AppRouter } from '../router';
import { JournalRepo } from '../../modules/jounals/journal.repo.ts';
import { JournalPresenter } from '../../modules/jounals/journal.presenter.ts';
import { ApiClient, MockApi } from '../apiClient/apiClient.ts';
import { JournalController } from '../../modules/jounals/journal.controller.ts';
import { AuthClient } from '../../modules/auth/authClient.ts';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { Auth0Adapter } from '../auth/auth0Adapter.ts';
import { FetchApiClient } from '../apiClient/fetchApiClient.ts';
import { MockApiClient } from '../apiClient/mockApiClient.ts';

export class CompositionRoot {
  router: AppRouter | undefined;
  private authPresenter!: AuthPresenter;
  private authController!: AuthController;
  private authRepo!: AuthRepo;
  private journalRepo!: JournalRepo;
  private journalPresenter!: JournalPresenter;
  private journalController!: JournalController;
  private apiClient!: ApiClient | MockApi;
  private authClient!: AuthClient | Auth0Client;

  constructor(private context: 'test' | 'production' = 'production') {}

  async create() {
    const result = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      authorizationParams: {
        redirect_uri: `${window.location.origin}/creating-account`,
        audience: process.env.AUTH0_AUDIENCE || '',
        scope: 'openid profile email',
      },
      cacheLocation: 'localstorage',
    })

    this.authClient = new Auth0Adapter(result);
    this.authRepo = new AuthRepo(this.authClient);
    this.authController = new AuthController(this.authRepo);
    this.authPresenter = new AuthPresenter(this.authRepo);

    if (this.context !== 'test') {
      this.authController = new AuthController(this.authRepo);
      this.apiClient = new FetchApiClient(
        process.env.API_URL || 'http://localhost:3000',
        this.authController
      );
    } else {
      this.authController = new AuthController(this.authRepo);
      this.apiClient = new MockApiClient(
        'http://localhost:3000',
        this.authController
      );
    }

    this.journalRepo = new JournalRepo(this.apiClient);
    this.journalController = new JournalController(this.journalRepo);
    this.journalPresenter = new JournalPresenter(this.journalRepo);
    this.router = new AppRouter(this.authController, this.getJournalModule());
    return true;
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

  getApiClient(): ApiClient | MockApi {
    if (!this.apiClient) {
      throw new Error('Api client not set up');
    }

    return this.apiClient;
  }
}

const compositionRoot: CompositionRoot = new CompositionRoot();

async function createCompositionRoot() {
  const result = await compositionRoot.create();
  return result;
}

export { compositionRoot, createCompositionRoot };
