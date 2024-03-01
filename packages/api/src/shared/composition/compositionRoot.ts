import { ApiServer } from '../http/apiServer';
import { Database } from '@efuller/api/src/shared/persistence/database/database';
import { JournalController } from '@efuller/api/src/modules/journals/journal.controller';
import { JournalService } from '@efuller/api/src/modules/journals/journal.service';
import { AuthMiddleware } from '@efuller/api/src/shared/http/middleware/authMiddleware';
// import { Auth0AuthService } from '@efuller/api/src/modules/auth/auth0AuthService';
import { JournalRouter } from '@efuller/api/src/shared/http/routers/journalRouter';
import { ClerkAuthService } from '@efuller/api/src/modules/auth/clerkAuthService';

export class CompositionRoot {
  private readonly db: Database;
  private readonly apiServer: ApiServer;

  constructor() {
    this.db = new Database();
    this.apiServer = this.createApiServer();
  }

  createApiServer() {
    // const authService = new Auth0AuthService();
    const authService = new ClerkAuthService();
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
}