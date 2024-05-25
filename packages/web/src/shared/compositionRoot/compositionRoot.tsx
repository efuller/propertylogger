import { AuthRepo } from '../../modules/auth/auth.repo.ts';
import { AuthPresenter } from '../../modules/auth/auth.presenter.ts';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { AppRouter } from '../router';
import { JournalRepo } from '../../modules/jounals/journal.repo.ts';
import { JournalPresenter } from '../../modules/jounals/journal.presenter.ts';
import { ApiClient, MockApi } from '../apiClient/apiClient.ts';
import { JournalController } from '../../modules/jounals/journal.controller.ts';
import { AuthClient } from '../../modules/auth/authClient.ts';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0Adapter } from '../auth/auth0Adapter.ts';
import { FetchApiClient } from '../apiClient/fetchApiClient.ts';
import { MockApiClient } from '../apiClient/mockApiClient.ts';
import { VerificationPresenter } from '../../modules/verification/presentation/verification.presenter.ts';
import { VerificationController } from '../../modules/verification/application/verification.controller.ts';
import { Auth0VerificationService } from '../../modules/verification/infra/auth0Verification.service.ts';
import { MockVerificationService } from '../../modules/verification/infra/mockVerification.service.ts';
import { VerificationRepo } from '../../modules/verification/infra/verification.repo.ts';
import { VerificationService } from '../../modules/verification/application/verificationService.ts';
import { createAuthClient } from '../auth/createAuthClient.ts';

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
  private verificationPresenter!: VerificationPresenter;
  private verificationController!: VerificationController;
  private verificationRepo!: VerificationRepo;
  private verificationService!: VerificationService;

  constructor(private context: 'test' | 'production' = 'production') {}

  async create() {
    const authClient = await createAuthClient<Auth0Client>(this.context);

    this.authClient = new Auth0Adapter(authClient);
    this.authRepo = new AuthRepo(this.authClient);
    this.authController = new AuthController(this.authRepo);
    this.authPresenter = new AuthPresenter(this.authRepo);
    this.verificationRepo = new VerificationRepo();
    this.verificationPresenter = new VerificationPresenter(this.verificationRepo);

    if (this.context !== 'test') {
      this.verificationService = new Auth0VerificationService();
      this.verificationController = new VerificationController(
        this.verificationService,
        this.verificationRepo
      );
    } else {
      this.verificationService = new MockVerificationService();
      this.verificationController = new VerificationController(
        this.verificationService,
        this.verificationRepo
      );
    }

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
    this.router = new AppRouter(
      this.authController,
      this.getJournalModule(),
      this.getVerificationModule()
    );
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

  getVerificationModule() {
    return {
      presenter: this.verificationPresenter,
      controller: this.verificationController,
      verificationService: this.verificationService,
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
