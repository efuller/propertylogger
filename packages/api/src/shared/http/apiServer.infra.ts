import { RestApiDriver } from './restApiDriver';
import { Server } from 'http';
import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';
import { ApiResponse } from '@efuller/shared/src/api';

describe('Web Server', () => {
  const compositionRoot = new CompositionRoot('test');
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

  it('should be able to check server health', async () => {
    const server = apiServer.getServer();
    const restApiDriver = new RestApiDriver(server as Server);
    await apiServer.start();
    const response = await restApiDriver.get<ApiResponse<void>>('/health');
    expect(response.success).toBe(true);
  });
});