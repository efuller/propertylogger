import { MemberRepo } from './member.repo.ts';
import { Member } from './member.model.ts';

export class MemberController {
  constructor(
    private memberRepo: MemberRepo
  ) {}

  async createMember(member: Member) {
    await this.memberRepo.createMember(member);
  }
}