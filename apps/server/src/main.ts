// Load environment variables FIRST, before any other imports
// This ensures DATABASE_URL and other env vars are available when Prisma client is imported
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}.local`;
const envPath = resolve(process.cwd(), envFile);

if (!existsSync(envPath)) {
  throw new Error(
    `Environment file not found: ${envFile}\n` +
      `Expected location: ${envPath}\n` +
      `See: docs/environment-setup.md`
  );
}

config({ path: envPath });
console.log(`✅ Loaded environment variables from: ${envFile}`);

import { createApp } from './app.js';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = createApp();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ health ] http://${host}:${port}/api/health`);
  console.log(`[ hello ] http://${host}:${port}/api/hello`);
  console.log(`[ docs ] http://${host}:${port}/api/docs`);
  console.log(`[ spec ] http://${host}:${port}/api/docs/openapi.json`);
});
