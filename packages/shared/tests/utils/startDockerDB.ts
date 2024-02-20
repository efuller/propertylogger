import execSh from 'exec-sh';

let started = false;

export const startDockerDB = async (dockerComposeFile: string, cwd = './') => {
  if (started) {
    return;
  }
  console.log('\n', '-----------------------------------');
  console.log('Starting docker db.');
  console.log('-----------------------------------');

  started = true;
  const result = await execSh.promise(
    `docker compose -f ${dockerComposeFile} up -d --wait --build`,
    {
      cwd,
      stdio: 'inherit',
    },
  );
  console.log(result.stdout, result.stderr);

  console.log('-----------------------------------');
  console.log('Docker started!');
  console.log('-----------------------------------');
};
