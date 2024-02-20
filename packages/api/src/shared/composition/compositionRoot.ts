import { ApiServer } from '../http/apiServer';
import { Database } from '@efuller/api/src/shared/persistence/database/database';
import { JournalController } from '@efuller/api/src/modules/journals/journal.controller';
import { JournalService } from '@efuller/api/src/modules/journals/journal.service';

export class CompositionRoot {
  private readonly db: Database;
  private readonly apiServer: ApiServer;

  constructor() {
    this.db = new Database();
    this.apiServer = this.createApiServer();
  }

  createApiServer() {
    const journalService = new JournalService(this.db);
    const journalController = new JournalController(journalService);

    return new ApiServer({ journal: journalController });
  }

  getApiServer() {
    return this.apiServer;
  }

  getDatabase() {
    return this.db;
  }
}