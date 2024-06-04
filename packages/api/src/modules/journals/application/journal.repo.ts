import { Journal } from '@prisma/client';
import { ApiResponse } from '@efuller/shared/src/api';

export interface JournalRepo {
  createJournal(title: string, content: string): Promise<ApiResponse<Journal>>;
  getJournals(): Promise<ApiResponse<Journal[]>>;
}