import { JournalRepo } from '@efuller/api/src/modules/journals/application/journal.repo';
import { ApiResponse } from '@efuller/shared/src/api';
import { CreateJournalDto, JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';
import { randomUUID } from 'crypto';

export class InMemoryJournalRepo implements JournalRepo {
  private journals: JournalDto[] = [];

  async createJournal(journal: CreateJournalDto): Promise<ApiResponse<JournalDto>> {
    const newJournal = {...journal, id: randomUUID()};
    this.journals.push(newJournal);

    return {
      success: true,
      data: { ...newJournal },
    }
  }

  async getJournals(): Promise<ApiResponse<JournalDto[]>> {
    if (!this.journals.length) {
      return {
        success: true,
        data: [],
      }
    }

    return {
      success: true,
      data: [...this.journals],
    }
  }
}