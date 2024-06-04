import { ApiServer } from '../http/apiServer';
import { JournalService } from '@efuller/api/src/modules/journals/application/journal.service';
import { Auth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0Auth.service';
import { Application } from '../application';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { Database } from '@efuller/api/src/shared/persistence/database';
import { PrismaJournalRepo } from '@efuller/api/src/modules/journals/adapters/prismaJournal.repo';

export class CompositionRoot {
  private readonly db: Database;
  private readonly apiServer: ApiServer;
  private authService!: Auth0AuthService;
  private journalService!: JournalService;
  private readonly application: Application;

  constructor() {
    this.db = this.createDatabase();
    this.application = this.createApplication();
    this.apiServer = this.createApiServer();
  }

  private createDatabase() {
    const prismaClient = new PrismaDbClient();

    return {
      journals: new PrismaJournalRepo(prismaClient),
      reset: async () => {
        await prismaClient.reset();
      }
    }
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