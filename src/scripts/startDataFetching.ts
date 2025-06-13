import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsNodePath = path.join(process.cwd(), 'node_modules/.bin/ts-node.cmd');

function runScript(scriptPath: string) {
  console.log('Running script:', scriptPath);
  return new Promise((resolve, reject) => {
    exec(`${tsNodePath} ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${scriptPath}:`, error);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr from ${scriptPath}:`, stderr);
      }
      console.log(`stdout from ${scriptPath}:`, stdout);
      resolve(stdout);
    });
  });
}

async function main() {
  try {
    console.log('Starting data fetching tasks...');
    
    // First, fetch all historical matches
    console.log('Fetching historical matches...');
    const scriptPath = path.join(process.cwd(), 'dist/scripts/fetchMatches.js');
    console.log('tsNodePath:', tsNodePath);
    console.log('scriptPath:', scriptPath);
    
    await runScript(scriptPath);
    
    // Then start the periodic checker
    console.log('Starting periodic match checker...');
    const checkNewMatchesPath = path.join(process.cwd(), 'dist/scripts/checkNewMatches.js');
    await runScript(checkNewMatchesPath);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main(); 