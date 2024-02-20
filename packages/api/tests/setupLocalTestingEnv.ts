import path from 'path';
import { generatePrismaClient } from '@efuller/shared/tests/utils/generatePrismaClient';
import { startDockerDB } from '@efuller/shared/tests/utils/startDockerDB';
import { setupEnvVars } from '@efuller/shared/tests/utils/setupEnvVars';

export default async () => {
  const rootCwd = path.join(__dirname, '../');

  await startDockerDB('docker-compose.test.yml', rootCwd);
  setupEnvVars('./packages/api/.env.test');
  await generatePrismaClient('.env.test', rootCwd);
};
