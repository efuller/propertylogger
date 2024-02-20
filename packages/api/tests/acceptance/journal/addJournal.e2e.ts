import { loadFeature, defineFeature } from 'jest-cucumber';
import { RestApiDriver } from '../../../src/shared/http/restApiDriver';
import { Server } from 'http';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { ApiResponse } from '@efuller/shared/src/api';
import { Journal } from '@efuller/api/src/modules/journals/journal.service';

const feature = loadFeature('./packages/shared/tests/journal/e2e/addJournal.feature', { tagFilter: '@api' });

defineFeature(feature, (test) => {
  test('User sends data to create a new journal', ({ given, when, then, and }) => {
    const compositionRoot = new CompositionRoot();
    const apiServer = compositionRoot.getApiServer();
    const db = compositionRoot.getDatabase();
    let apiDriver: RestApiDriver;
    let response: ApiResponse<Partial<Partial<Journal>>>;

    beforeAll(async () => {
      await apiServer.start();
      apiDriver = new RestApiDriver(apiServer.getServer() as Server);
    })

    afterAll(async () => {
      await apiServer.stop();
      await db.reset();
    });

    given('The backend API is accessible', async () => {
      expect(apiServer.isRunning()).toBeTruthy();
    });

    when(/^a user sends a POST request to the "(.*)" endpoint with a title of (.*) and content of (.*)$/, async (endpoint, title, content) => {
      response = await apiDriver.post<Partial<Journal>>(endpoint, { title, content });
    });

    then(/^the API should respond with a success of true$/, () => {
      expect(response.success).toBe(true);
    });

    and(/^the response should contain title of (.*) and content of (.*)$/, (title, content) => {
      expect(response.data).toMatchObject({ data: { title, content }, success: true });
    });
  });
});