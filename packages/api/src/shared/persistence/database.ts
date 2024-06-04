import { JournalRepo } from '@efuller/api/src/modules/journals/application/journal.repo';

export interface Database {
  journals: JournalRepo;
  reset(): Promise<void>; // TODO: This should be removed in production.
}