import execSh from 'exec-sh';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import path from 'path';

export const generatePrismaClient = async (
  envFile: string,
  rootCwd: string,
) => {
  console.log('-----------------------------------');
  console.log('Generating Prisma client...');
  console.log('-----------------------------------');

  const schemaPath = path.join(rootCwd, 'prisma/schema.prisma');
  const envPath = path.join(rootCwd, envFile);
  const out = await execSh.promise(
    `dotenv -e ${envPath} -- prisma generate --schema=${schemaPath}`,
    {
      cwd: rootCwd,
    },
  );
  console.log(out.stdout, out.stderr);
  console.log('-----------------------------------');
  console.log('Prisma client generated!');
  console.log('-----------------------------------');

  await sleep(1000);

  console.log('-----------------------------------');
  console.log('Resetting the DB');
  console.log('-----------------------------------');

  const resetOut = await execSh.promise(
    `dotenv -e ${envPath} -- prisma db push --force-reset --schema=${schemaPath}`,
    true,
  );
  console.log(resetOut.stdout, resetOut.stderr);
  console.log('-----------------------------------');
  console.log('DB Reset!');
  console.log('-----------------------------------');

  await sleep(1000);
};
