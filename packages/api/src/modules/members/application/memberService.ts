import { Database } from '@efuller/api/src/shared/persistence/database';
import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';
import { ApiResponse } from '@efuller/shared/src/api';

export class MemberService {
  private readonly db: Database;

  constructor(memberRepo: Database) {
    this.db = memberRepo;
  }

  async createMember(member: CreateMemberDto): Promise<ApiResponse<MemberDto>> {
    const newMember = await this.db.members.createMember(member);

    return {
      error: false,
      success: true,
      data: newMember,
    };
  }

  async getMemberByEmail(email: string): Promise<ApiResponse<MemberDto | null>> {
    const member = await this.db.members.getMemberByEmail(email);

    if (!member) {
      return {
        error: false,
        success: false,
        data: null,
      };
    }

    return {
      error: false,
      success: true,
      data: member,
    };
  }
}