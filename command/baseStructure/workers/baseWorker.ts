// @ts-ignore
import { parentPort, workerData } from 'worker_threads';
import { MBaseService } from '@service/MBaseService';

async function run() {
  try {
    let result;

    switch (workerData.action) {
      case 'create':
        result = await MBaseService.create(workerData.payload);
        break;
      case 'getAll':
        result = await MBaseService.getAll();
        break;
      case 'getById':
        result = await MBaseService.getById(workerData.id);
        break;
      case 'update':
        result = await MBaseService.update(workerData.id, workerData.payload);
        break;
      case 'delete':
        result = await MBaseService.delete(workerData.id);
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
