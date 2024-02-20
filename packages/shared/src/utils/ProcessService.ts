import { exec } from 'child_process';

class ProcessService {
  public static async killProcessOnPort(port: number) {
    return new Promise((resolve, reject) => {
      const command = `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error killing processes on port ${port}:`, stderr);
          reject(false);
        } else {
          if (stdout.trim() !== '') {
            console.log(`Successfully killed processes using port ${port}:`, stdout);
          } else {
            console.log(`No processes found using port ${port}.`);
          }
          resolve(true);
        }
      });
    });
  }
}

export { ProcessService };