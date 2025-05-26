import { parentPort, workerData } from 'worker_threads';
import { UserService } from '@service/UserService';

async function run() {
  try {
    let result:any;

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
     let cleanResult: any;
      if (Array.isArray(result)) {
        cleanResult = result.map(cleanDocument);
      } else {
        cleanResult = cleanDocument(result);
      }


    parentPort?.postMessage({ success: true, data: cleanResult });
  } catch (error: any) {
    parentPort?.postMessage({ success: false, error: error.message });
  }
}


export const cleanDocument = (doc: any): any => {
  if (!doc) return null;

  // If it has dataValues, return a shallow copy of it
  if (doc.dataValues) {
    return { ...doc.dataValues };
  }

  // If it's an array, clean each item
  if (Array.isArray(doc)) {
    return doc.map(cleanDocument);
  }

  // Fallback for plain objects or documents with toObject()
  const obj = doc?.toObject?.() || doc;

  if (obj && obj._id && typeof obj._id.toString === 'function') {
    obj._id = obj._id.toString();
  }

  return obj;
}

run();
