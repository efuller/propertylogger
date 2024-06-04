import { ApiServer } from '../http/apiServer';
import { Database } from '@efuller/api/src/shared/persistence/database/database';
import { JournalService } from '@efuller/api/src/modules/journals/application/journal.service';
import { Auth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0Auth.service';
import { Application } from '../application';

export class CompositionRoot {
  private readonly db: Database;
  private readonly apiServer: ApiServer;
  private authService!: Auth0AuthService;
  private journalService!: JournalService;
  private readonly application: Application;

  constructor() {
    this.db = new Database();
    this.application = this.createApplication();
    this.apiServer = this.createApiServer();
  }

  createApiServer() {
    return new ApiServer(this.application);
  }

  private createApplication() {
    return {
      auth: this.getAuthService(),
      journals: this.getJournalService(),
    };
  }

  private createJournalService() {
    return new JournalService(this.db);
  }

  private createAuthService() {
    if (!this.authService) {
      this.authService = new Auth0AuthService();
    }
    return this.authService;
  }

  public getApplication() {
    if (!this.application) {
      return this.createApplication();
    }
    return this.application;
  }

  public getAuthService() {
    if (!this.authService) {
      return this.createAuthService();
    }
    return this.authService;
  }

  public getJournalService() {
    if (!this.journalService) {
      return this.createJournalService();
    }
    return this.journalService;
  }

  getApiServer() {
    return this.apiServer;
  }

  getDatabase() {
    return this.db;
  }
}