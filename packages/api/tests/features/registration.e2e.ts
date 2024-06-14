import { loadFeature, defineFeature } from 'jest-cucumber';
import { RestApiDriver } from '../../src/shared/http/restApiDriver';
import { Server } from 'http';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { ApiResponse } from '@efuller/shared/src/api';
import { CreateMemberDto, MemberDto } from '@efuller/api/src/modules/members/application/member.dto';

const feature = loadFeature(
  './packages/shared/tests/features/registration.feature',
  { tagFilter: '@api' }
);

defineFeature(feature, (test) => {
  let apiDriver: RestApiDriver;
  // TODO: Member should really be a shared entity/model.
  let response: ApiResponse<Partial<CreateMemberDto>>;
  let user: CreateMemberDto;

  test('Create new member using the API', ({ given, when, then }) => {
    const compositionRoot = new CompositionRoot('test');
    const apiServer = compositionRoot.getApiServer();
    const db = compositionRoot.getDatabase();

    beforeAll(async () => {
      await apiServer.start();
      apiDriver = new RestApiDriver(apiServer.getServer() as Server);
    });

    afterEach(async () => {
      await db.reset();
    });

    afterAll(async () => {
      await apiServer.stop();
      await db.reset();
    });

    given('I am a new user', () => {
      // TODO: Need a createUser builder.
      user = { email: 'admin@test.com' };
    });

    when('I request to create a member account', async () => {
      response = await apiDriver.post<CreateMemberDto, MemberDto>('/member', user);
    });

    then('a new member account is created for me', () => {
      expect(response.error).toBe(false);
      expect(response.success).toBe(true);
      expect(response.data).toMatchObject(expect.objectContaining(user));
    });
  });

  test('Create and retrieve new member by email address using the API', ({ given, when, then }) => {
    given('I am a new user', () => {
      // TODO: Need a createUser builder.
      user = { email: 'admin@test.com' };
    });

    when('I request to create a member account', async () => {
      response = await apiDriver.post<CreateMemberDto, MemberDto>('/member', user);
    });

    then('I am able to retrieve that member account by email', async () => {
      const result = await apiDriver.get(`/member/?${user.email}`);
      console.log('RESULT', result);

      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(expect.objectContaining(user));
    });
  });
});