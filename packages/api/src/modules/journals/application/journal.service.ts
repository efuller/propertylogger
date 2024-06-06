import { ApiResponse } from '@efuller/shared/src/api';
import { Database } from '@efuller/api/src/shared/persistence/database';
import { CreateJournalDto, JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

export class JournalService {
  constructor(private readonly db: Database) {}

  async createJournal(dto: CreateJournalDto): Promise<ApiResponse<JournalDto>> {
    const result = await this.db.journals.createJournal(
      dto.title,
      dto.content,
    );

    return result;
  }

  async getJournals(): Promise<ApiResponse<JournalDto[]>> {
    const result = await this.db.journals.getJournals();

    return result;
  }
}