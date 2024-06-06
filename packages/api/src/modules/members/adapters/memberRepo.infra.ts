import { PrismaMemberRepo } from '@efuller/api/src/modules/members/adapters/prismaMember.repo';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';

describe('MemberRepo', () => {
  const memberRepos = [
    new PrismaMemberRepo(new PrismaDbClient())
  ];

  it('should create a new member and retried it by email', async () => {
    const member = {
      email: 'admin@test.com'
    };

    for (const memberRepo of memberRepos) {
      const createdMember = await memberRepo.createMember(member);

      expect(createdMember.email).toBe(member.email);

      const foundMember = await memberRepo.getMemberByEmail(member.email);

      expect(foundMember).not.toBeNull();
      expect(foundMember!.email).toBe(member.email);
    }
  });
});
