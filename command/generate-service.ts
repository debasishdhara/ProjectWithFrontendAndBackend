import fs from 'fs';
import path from 'path';
import { createFile } from './work/fileUpdateAndCreate';

// Get the router name passed as an argument
const routerName: string | undefined = process.argv[2];

// Validate the router name
if (!routerName) {
  console.error('Please provide a router name.');
  process.exit(1);
}


if ((routerName).toLocaleLowerCase() === 'default' || (routerName).toLocaleLowerCase() === 'pbase' || (routerName).toLocaleLowerCase() === 'mbase' || (routerName).toLocaleLowerCase() === 'sbase') {
  console.error('❌ Please provide a service name other than "default", "pbase", "mbase", or "sbase".');
  process.exit(1);
}

// Convert to Sentence Case
const toSentenceCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// Define the path to paste
const dirPath: string = path.join(__dirname, '../');

// For service creation
const controllersourcePath: string = path.join(__dirname, 'baseStructure', 'services', 'BaseService.ts');
const controllerdestinationPath: string = path.join(dirPath, 'app', 'service', `${toSentenceCase(routerName)}Service.ts`);

(async () => {
  if (fs.existsSync(controllerdestinationPath)) {
    console.log(`⚠️ Service already exists at ${controllerdestinationPath}. Skipping creation.`);
  } else {
    const resultOfController = await createFile(controllersourcePath, controllerdestinationPath, routerName);
    console.log(`✅ Service created at ${controllerdestinationPath}`);
  }
})();
