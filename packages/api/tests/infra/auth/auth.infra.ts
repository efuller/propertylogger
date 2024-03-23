import { Server } from 'http';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { RestApiDriver } from '@efuller/api/src/shared/http/restApiDriver';

describe('Auth', () => {
  const compositionRoot = new CompositionRoot();
  const apiServer = compositionRoot.getApiServer();

  beforeEach(async () => {
    await apiServer.stop();
  });

  afterEach(async () => {
    await apiServer.stop();
  });

  it('should be able to start and stop the server', async () => {
    await apiServer.start();
    expect(apiServer.isRunning()).toBeTruthy();
  });

  it('should 401 if no token is provided in the request', async () => {
    const server = apiServer.getServer();
    const restApiDriver = new RestApiDriver(server as Server);
    await apiServer.start();
    const response = await restApiDriver.get('/journal');
    expect(response.status).toBe(401);
  });
});