import { ApiResponse } from '@efuller/shared/src/api';
import { CreateJournalDto, JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

export interface JournalRepo {
  createJournal(user: CreateJournalDto): Promise<ApiResponse<JournalDto>>;
  getJournals(): Promise<ApiResponse<JournalDto[]>>;
}