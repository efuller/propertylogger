import path from 'path';
import { generatePrismaClient } from '@efuller/shared/tests/utils/generatePrismaClient';
import { setupEnvVars } from '@efuller/shared/tests/utils/setupEnvVars';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async () => {
  const rootCwd = path.join(__dirname, '../');

  setupEnvVars('./packages/api/.env.test');
  await generatePrismaClient('.env.test', rootCwd);
  await sleep(1000);
};
