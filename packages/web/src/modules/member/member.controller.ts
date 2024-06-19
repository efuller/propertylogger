import { MemberRepo } from './member.repo.ts';
import { Member } from './member.model.ts';

export class MemberController {
  constructor(
    private memberRepo: MemberRepo
  ) {}

  async createMember(member: Member) {
    return await this.memberRepo.createMember(member);
  }

  async getMemberByEmail(email: string) {
    return await this.memberRepo.getMemberByEmail(email);
  }

  async setMember(member: Member) {
    this.memberRepo.member = member;
  }
}