import fs from 'fs/promises';
import path from 'path';

const cacheDir = path.join(__dirname, 'cache');
const mongoCachePath = path.join(cacheDir, 'mongo-models.cache.json');

// Type for cached model data
interface MongoCache {
  models: string[];
  timestamp: number;
  schemaVersion?: string; // optional for future migration/version tracking
}

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(cacheDir, { recursive: true });
  } catch (err) {
    console.error('Error creating cache directory:', err);
  }
}

async function hasMongoCache(): Promise<boolean> {
  try {
    const stat = await fs.stat(mongoCachePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function writeMongoCache(modelData:any): Promise<void> {
  const payload: any = modelData;
  try {
    await ensureCacheDir(); // Ensure dir before writing
    await fs.writeFile(mongoCachePath,modelData, 'utf-8');
    console.log('Mongo model cache written.');
  } catch (err) {
    console.error('Error writing mongo cache:', err);
  }
}

async function clearMongoCache(): Promise<void> {
  try {
    await fs.unlink(mongoCachePath);
    console.log('Mongo cache cleared');
  } catch {
    // File doesn't exist – ignore
  }
}

async function readMongoCache(): Promise<any | null> {
  try {
    const data = await fs.readFile(mongoCachePath, 'utf-8');
    const parsed: any = JSON.parse(data);
    return parsed;
  } catch (err) {
    console.error('Error reading mongo cache file:', err);
    return null;
  }
}

export {
  ensureCacheDir,
  hasMongoCache,
  writeMongoCache,
  clearMongoCache,
  readMongoCache,
  type MongoCache,
};
