import { randomUUID } from 'crypto';
import { MemberRepo } from '@efuller/api/src/modules/members/application/member.repo';
import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';

export class InMemoryMemberRepo implements MemberRepo {
  private readonly members: MemberDto[] = [];

  async createMember(member: CreateMemberDto): Promise<MemberDto> {
    const newMember = {
      id: randomUUID(),
      email: member.email,
    };

    this.members.push(newMember);

    return newMember;
  }

  async getMemberByEmail(email: string): Promise<MemberDto | null> {
    const member = this.members.find((m) => m.email === email);

    if (!member) {
      return null;
    }

    return member;
  }
}