import { ApiServer } from '../http/apiServer';
import { JournalService } from '@efuller/api/src/modules/journals/application/journal.service';
import { Auth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0Auth.service';
import { WebApp } from '../application';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { Database } from '@efuller/api/src/shared/persistence/database';
import { PrismaJournalRepo } from '@efuller/api/src/modules/journals/adapters/prismaJournal.repo';
import { MemberService } from '@efuller/api/src/modules/members/application/memberService';
import { PrismaMemberRepo } from '@efuller/api/src/modules/members/adapters/prismaMember.repo';
import { InMemoryJournalRepo } from '@efuller/api/src/modules/journals/adapters/inMemoryJournal.repo';
import { InMemoryMemberRepo } from '@efuller/api/src/modules/members/adapters/inMemoryMember.repo';

export type Environment = 'development' | 'test' | 'production';

export class CompositionRoot {
  private readonly context: Environment;
  private readonly db: Database;
  private readonly apiServer: ApiServer;
  private authService!: Auth0AuthService;
  private journalService!: JournalService;
  private memberService!: MemberService;
  private readonly application: WebApp;

  constructor(context: Environment) {
    this.context = context;
    this.db = this.createDatabase();
    this.application = this.createApplication();
    this.apiServer = this.createApiServer();
  }

  private createDatabase() {
    if (this.context !== 'development') {
      const prismaClient = new PrismaDbClient();

      return {
        journals: new PrismaJournalRepo(prismaClient),
        members: new PrismaMemberRepo(prismaClient),
        reset: async () => {
          await prismaClient.reset();
        }
      }
    }

    return {
      journals: new InMemoryJournalRepo(),
      members: new InMemoryMemberRepo(),
      reset: async () => {
        return Promise.resolve();
      }
    }
  }

  createApiServer() {
    return new ApiServer(this.application);
  }

  private createApplication(): WebApp {
    return {
      auth: this.getAuthService(),
      journals: this.getJournalService(),
      members: this.getMemberService(),
    };
  }

  private createMemberService() {
    return new MemberService(this.db);
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

  public getMemberService() {
    if (!this.memberService) {
      return this.createMemberService();
    }
    return this.memberService;
  }

  getApiServer() {
    return this.apiServer;
  }

  getDatabase() {
    return this.db;
  }
}