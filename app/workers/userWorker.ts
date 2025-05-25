import { parentPort, workerData } from 'worker_threads';
import { UserService } from '@service/UserService';

async function run() {
  try {
    let result;

    switch (workerData.action) {
      case 'create':
        result = await UserService.create(workerData.payload);
        break;
      case 'getAll':
        result = await UserService.getAll();
        break;
      case 'getById':
        result = await UserService.getById(workerData.id);
        break;
      case 'update':
        result = await UserService.update(workerData.id, workerData.payload);
        break;
      case 'delete':
        result = await UserService.delete(workerData.id);
        break;
      default:
        throw new Error('Invalid action');
    }
      // 🧼 Clean Mongoose documents
     const cleanResult = Array.isArray(result)
      ? result.map(cleanDocument)
      : cleanDocument(result);

    parentPort?.postMessage({ success: true, data: cleanResult });
  } catch (error: any) {
    parentPort?.postMessage({ success: false, error: error.message });
  }
}

function cleanDocument(doc: any) {
  const obj = doc?.toObject?.() || doc;

  if (obj && obj._id && typeof obj._id.toString === 'function') {
    obj._id = obj._id.toString();
  }

  return obj;
}

run();
