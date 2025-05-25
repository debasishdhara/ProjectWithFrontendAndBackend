import { Worker } from 'worker_threads';
import 'tsconfig-paths/register';
import path from 'path';

export async function runWorker(workerFile: string, action: string, data: Record<string, any> = {}) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, workerFile);

    const worker = new Worker(workerPath, {
      execArgv: ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'], // <-- this tells the worker to run ts-node/register
      workerData: { action, ...data },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}
