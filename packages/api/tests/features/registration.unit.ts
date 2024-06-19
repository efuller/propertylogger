import { loadFeature, defineFeature } from 'jest-cucumber';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { ApiResponse } from '@efuller/shared/src/api';
import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';

const feature = loadFeature(
  './packages/shared/tests/features/registration.feature',
  { tagFilter: '@api and not @e2e' }
);

defineFeature(feature, (test) => {
  test('Create new member using the API', ({ given, when, then }) => {
    const compositionRoot = new CompositionRoot('development');
    const application = compositionRoot.getApplication();
    let response: ApiResponse<MemberDto>;
    let user: CreateMemberDto;

    given('I am a new user', () => {
      // TODO: Need a createUser builder.
      user = { email: 'admin@test.com' };
    });

    when('I request to create a member account', async () => {
      response = await application.members.createMember(user);
    });

    then('a new member account is created for me', () => {
      expect(response.success).toBe(true);
      expect(response.error).toBe(false);
      expect(response.data).toMatchObject(user);
    });
  });
});