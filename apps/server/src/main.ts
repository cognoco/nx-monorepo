// Load environment variables FIRST, before any other imports
// This ensures DATABASE_URL and other env vars are available when Prisma client is imported
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}.local`;
const envPath = resolve(process.cwd(), envFile);

// Environment loading strategy (12-Factor App compliant):
// 1. If env file exists, load it (local development)
// 2. If no file but DATABASE_URL is set, proceed (CI/production via env vars)
// 3. If neither, fail with helpful message
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log(`✅ Loaded environment from: ${envFile}`);
} else if (process.env.DATABASE_URL) {
  console.log(`✅ Using environment variables (no ${envFile} file)`);
} else {
  throw new Error(
    `Environment file not found: ${envFile}\n` +
      `Expected location: ${envPath}\n` +
      `And DATABASE_URL environment variable is not set.\n` +
      `See: docs/project-config/supabase.md`
  );
}

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
