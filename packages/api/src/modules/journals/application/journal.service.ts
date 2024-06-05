import { ApiResponse } from '@efuller/shared/src/api';
import { Database } from '@efuller/api/src/shared/persistence/database';
import { JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';
import { Journal } from '../domain/journal';

export class JournalService {
  constructor(private readonly db: Database) {}

  async createJournal(dto: JournalDto): Promise<ApiResponse<Journal>> {
    const result = await this.db.journals.createJournal(
      dto.props.title,
      dto.props?.content || '',
    );

    return result;
  }

  async getJournals(): Promise<ApiResponse<Journal[]>> {
    const result = await this.db.journals.getJournals();

    return result;
  }
}