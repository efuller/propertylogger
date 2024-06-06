import { MemberRepo } from '@efuller/api/src/modules/members/application/member.repo';
import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';

export class PrismaMemberRepo implements MemberRepo {
  public constructor(private readonly db: PrismaDbClient) {}

  async createMember(member: CreateMemberDto): Promise<MemberDto> {
    const result = await this.db.getClient().member.create({
      data: {
        email: member.email,
      },
    });

    return {
      id: result.id,
      email: result.email,
    };
  }

  async getMemberByEmail(email: string): Promise<MemberDto | null> {
    const result = await this.db.getClient().member.findFirst({
      where: {
        email,
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      email: result.email,
    };
  }
}