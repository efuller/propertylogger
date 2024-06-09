import { JournalRepo } from '@efuller/api/src/modules/journals/application/journal.repo';
import { MemberRepo } from '@efuller/api/src/modules/members/application/member.repo';

export interface Database {
  journals: JournalRepo;
  members: MemberRepo;
  reset(): Promise<void>; // TODO: This should be removed in production.
}