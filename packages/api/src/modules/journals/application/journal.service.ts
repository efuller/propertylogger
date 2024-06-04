import { ApiResponse } from '@efuller/shared/src/api';
import { Journal } from '../domain/journal';
import { Database } from '@efuller/api/src/shared/persistence/database';

export class JournalService {
  constructor(private readonly db: Database) {}

  async createJournal(title: string, content: string): Promise<ApiResponse<Journal>> {
    const result = await this.db.journals.createJournal(
      title,
      content,
    );

    return result;
  }

  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const result = await this.db.journals.getJournals();

    return result;
  }
}