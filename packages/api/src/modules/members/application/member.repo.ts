import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';

export interface MemberRepo {
  createMember(member: CreateMemberDto): Promise<MemberDto>;
  getMemberByEmail(email: string): Promise<MemberDto | null>;
}