import { Database } from '@efuller/api/src/shared/persistence/database/database';
import { ApiResponse } from '@efuller/shared/src/api';

export interface Journal {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class JournalService {
  constructor(private readonly db: Database) {}

  async createJournal(title: string, content: string): Promise<ApiResponse<Journal>> {
    const dbClient = this.db.getClient();

    const result = await dbClient.journal.create({
      data: {
        title,
        content,
      },
    });

    return {
      success: true,
      data: { ...result },
    }
  }

  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const dbClient = this.db.getClient();

    const result = await dbClient.journal.findMany();

    if (!result.length) {
      return {
        success: false,
        data: [],
      }
    }

    return {
      success: true,
      data: result.map((journal: Journal) => ({ ...journal })),
    }
  }
}