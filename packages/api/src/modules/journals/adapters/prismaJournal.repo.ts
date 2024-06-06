import { Journal } from '@prisma/client';
import { ApiResponse } from '@efuller/shared/src/api';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

export class PrismaJournalRepo {
  constructor(private readonly db: PrismaDbClient) {}

  async createJournal(title: string, content: string): Promise<ApiResponse<JournalDto>> {
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

  async getJournals(): Promise<ApiResponse<JournalDto[]>> {
    const dbClient = this.db.getClient();

    const result = await dbClient.journal.findMany();

    if (!result.length) {
      return {
        success: true,
        data: [],
      }
    }

    return {
      success: true,
      data: result.map((journal: Journal) => ({ ...journal })),
    }
  }
}