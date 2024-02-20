import path from 'path';
import { generatePrismaClient } from '@efuller/shared/tests/utils/generatePrismaClient';
import { startDockerDB } from '@efuller/shared/tests/utils/startDockerDB';
import { setupEnvVars } from '@efuller/shared/tests/utils/setupEnvVars';

export default async function setupDevEnv() {
  const rootCwd = path.join(__dirname);
  await startDockerDB('docker-compose.develop.yml', rootCwd);
  setupEnvVars('.env.development'); // This doesn't seem to be working or setting env vars for the server.
  await generatePrismaClient('.env.development', rootCwd);
}
setupDevEnv();