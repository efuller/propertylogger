import { AuthRepo } from '../../modules/auth/auth.repo.ts';
import { AuthPresenter } from '../../modules/auth/auth.presenter.ts';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { AppRouter } from '../router';
import { JournalRepo } from '../../modules/jounals/journal.repo.ts';
import { JournalPresenter } from '../../modules/jounals/journal.presenter.ts';
import { ApiClient, MockApi } from '../apiClient/apiClient.ts';
import { JournalController } from '../../modules/jounals/journal.controller.ts';
import { FetchApiClient } from '../apiClient/fetchApiClient.ts';
import { MockApiClient } from '../apiClient/mockApiClient.ts';
import { VerificationPresenter } from '../../modules/verification/presentation/verification.presenter.ts';
import { VerificationController } from '../../modules/verification/application/verification.controller.ts';
import { Auth0VerificationService } from '../../modules/verification/infra/auth0Verification.service.ts';
import { MockVerificationService } from '../../modules/verification/infra/mockVerification.service.ts';
import { VerificationRepo } from '../../modules/verification/infra/verification.repo.ts';
import { VerificationService } from '../../modules/verification/application/verificationService.ts';
import { MemberPresenter } from '../../modules/member/member.presenter.ts';
import { MemberRepo } from '../../modules/member/member.repo.ts';
import { MemberController } from '../../modules/member/member.controller.ts';
import { LoginPresenter } from '../../modules/login/login.presenter.ts';
import { LoginController } from '../../modules/login/login.controller.ts';
import { LoginRepo } from '../../modules/login/login.repo.ts';
import { AuthService } from '../../modules/auth/auth.service.ts';
import { createAuthClient } from '../../modules/auth/adapters/createAuthClient.ts';
import { AuthClient } from '../../modules/auth/authClient.ts';

export class CompositionRoot {
  router: AppRouter | undefined;
  private authPresenter!: AuthPresenter;
  private authController!: AuthController;
  private authRepo!: AuthRepo;
  private journalRepo!: JournalRepo;
  private journalPresenter!: JournalPresenter;
  private journalController!: JournalController;
  private apiClient!: ApiClient | MockApi;
  private authService!: AuthService;
  private verificationPresenter!: VerificationPresenter;
  private verificationController!: VerificationController;
  private verificationRepo!: VerificationRepo;
  private verificationService!: VerificationService;
  private memberPresenter!: MemberPresenter;
  private memberController!: MemberController;
  private memberRepo!: MemberRepo;
  private loginPresenter!: LoginPresenter;
  private loginController!: LoginController;
  private loginRepo!: LoginRepo;
  private authClient!: AuthClient;

  constructor(private context: 'test' | 'production' = 'production') {}

  async create() {
    this.authClient = await createAuthClient(this.context);

    this.authService = new AuthService(this.authClient);
    this.authRepo = new AuthRepo(this.authService);
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

    this.memberRepo = new MemberRepo(this.apiClient);
    this.memberPresenter = new MemberPresenter(this.memberRepo);
    this.memberController = new MemberController(
      this.memberRepo
    );
    this.loginRepo = new LoginRepo();
    this.loginPresenter = new LoginPresenter(this.loginRepo);
    this.loginController = new LoginController(this.authController, this.memberController, this.loginRepo);
    this.router = new AppRouter(
      this.getAuthModule(),
      this.getJournalModule(),
      this.getVerificationModule(),
      this.getMemberModule(),
      this.getLoginModule(),
    );
    return true;
  }

  getRouter(): AppRouter {
    if (!this.router) {
      throw new Error('Router not set up');
    }
    return this.router;
  }

  getLoginModule() {
    return {
      presenter: this.loginPresenter,
      controller: this.loginController,
    }
  }

  getAuthModule() {
    return {
      presenter: this.authPresenter,
      controller: this.authController,
    }
  }

  getMemberModule() {
    return {
      presenter: this.memberPresenter,
      controller: this.memberController,
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

  setAsLoggedIn(status = true) {
    if (!this.authRepo) {
      throw new Error('Auth repo not set up');
    }
    this.authRepo.authenticated = status;
  }

  getApiClient(): ApiClient | MockApi {
    if (!this.apiClient) {
      throw new Error('Api client not set up');
    }

    return this.apiClient;
  }

  getAuthClient() {
    if (!this.authClient) {
      throw new Error('Auth client not set up');
    }

    return this.authClient;
  }
}

const compositionRoot: CompositionRoot = new CompositionRoot();

async function createCompositionRoot() {
  const result = await compositionRoot.create();
  return result;
}

export { compositionRoot, createCompositionRoot };
