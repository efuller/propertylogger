import { JournalService } from '@efuller/api/src/modules/journals/application/journal.service';
import { AuthService } from '@efuller/api/src/modules/auth/application/auth.service';
import { MemberService } from '@efuller/api/src/modules/members/application/memberService';

export interface WebApp {
  auth: AuthService;
  journals: JournalService;
  members: MemberService;
}