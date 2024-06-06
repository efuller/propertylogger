import { ApiResponse } from '@efuller/shared/src/api';
import { JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

export interface JournalRepo {
  createJournal(title: string, content: string): Promise<ApiResponse<JournalDto>>;
  getJournals(): Promise<ApiResponse<JournalDto[]>>;
}