import { ApiResponse } from '@efuller/shared/src/api';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { CreateJournalDto, JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';
import { JournalRepo } from '@efuller/api/src/modules/journals/application/journal.repo';

export class PrismaJournalRepo implements JournalRepo {
  constructor(private readonly db: PrismaDbClient) {}

  async createJournal(user: CreateJournalDto): Promise<ApiResponse<JournalDto>> {
    const dbClient = this.db.getClient();
    const { title, content } = user;

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
      data: result.map((journal: JournalDto) => ({ ...journal })),
    }
  }
}