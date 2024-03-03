import { ApiServer } from '../http/apiServer';
import { Database } from '@efuller/api/src/shared/persistence/database/database';
import { JournalController } from '@efuller/api/src/modules/journals/adapters/journal.controller';
import { JournalService } from '@efuller/api/src/modules/journals/application/journal.service';
import { AuthMiddleware } from '@efuller/api/src/modules/auth/infra/middleware/authMiddleware';
import { Auth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0Auth.service';
import { JournalRouter } from '@efuller/api/src/shared/http/routers/journalRouter';
import { MockAuth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0AuthService.spy';

export class CompositionRoot {
  private readonly db: Database;
  private readonly apiServer: ApiServer;

  constructor() {
    this.db = new Database();
    this.apiServer = this.createApiServer();
  }

  createApiServer() {
    const authService = this.createAuthService();
    const authMiddleware = new AuthMiddleware(authService);
    const journalService = new JournalService(this.db);
    const journalController = new JournalController(journalService);
    const journalRouter = new JournalRouter(authMiddleware, journalController);

    return new ApiServer({ journal: journalRouter });
  }

  getApiServer() {
    return this.apiServer;
  }

  getDatabase() {
    return this.db;
  }

  createAuthService() {
    if (process.env.NODE_ENV === 'test') {
      return new MockAuth0AuthService();
    }
    return new Auth0AuthService();
  }
}