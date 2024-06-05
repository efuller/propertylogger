import { loadFeature, defineFeature } from 'jest-cucumber';
import { RestApiDriver } from '../../src/shared/http/restApiDriver';
import { Server } from 'http';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { ApiResponse } from '@efuller/shared/src/api';
import { Journal } from '@efuller/api/src/modules/journals/domain/journal';

const feature = loadFeature('./packages/shared/tests/features/addJournal.feature', { tagFilter: '@api' });

defineFeature(feature, (test) => {
  test('Create a new journal', ({ given, when, then, and }) => {
    const compositionRoot = new CompositionRoot('test');
    const apiServer = compositionRoot.getApiServer();
    const db = compositionRoot.getDatabase();
    let apiDriver: RestApiDriver;
    let response: ApiResponse<Partial<Partial<Journal>>>;
    let title: string;
    let content: string;

    beforeAll(async () => {
      await apiServer.start();
      apiDriver = new RestApiDriver(apiServer.getServer() as Server);
    })

    afterAll(async () => {
      await apiServer.stop();
      await db.reset();
    });

    given(/^I have created a new journal with a title of (.*) and content of (.*)$/, async (newTitle, newContent) => {
      title = newTitle;
      content = newContent;
      expect(apiServer.isRunning()).toBeTruthy();
    });

    when(/^I save the journal$/, async () => {
      console.log('title', title, 'content', content);
      response = await apiDriver.post<Partial<Journal>>('/journal', { title, content });
    });

    then(/^I should be able to retrieve the journal$/, () => {
      expect(response.data).toMatchObject({ data: { title, content }, success: true });
    });
  });
});