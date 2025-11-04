/**
 * Jest Setup File
 *
 * This file runs before each test file is executed.
 * It loads environment-specific .env files to ensure tests have access to:
 * - DATABASE_URL (Supabase connection string)
 * - DIRECT_URL (Direct Prisma connection)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Environment file loaded depends on NODE_ENV:
 * - NODE_ENV=test → .env.test.local
 * - NODE_ENV=development → .env.development.local
 *
 * @see docs/environment-setup.md for environment configuration
 * @see docs/memories/testing-reference.md for testing guidelines
 */

const { config } = require('dotenv');
const { resolve } = require('path');
const { existsSync } = require('fs');

// Load environment variables silently (no console output during tests)
// This runs before every test file, ensuring env vars are always available
try {
  const env = process.env.NODE_ENV || 'development';
  const envFile = `.env.${env}.local`;
  // Use __dirname to find workspace root (where this file lives)
  // NOT process.cwd() which varies based on which project runs tests
  const envPath = resolve(__dirname, envFile);

  if (!existsSync(envPath)) {
    throw new Error(
      `Environment file not found: ${envFile}\n` +
        `Expected location: ${envPath}\n` +
        `See: docs/environment-setup.md`
    );
  }

  config({ path: envPath });
  // Silent mode - no console output
} catch (error) {
  console.error('❌ Failed to load environment variables for tests:');
  console.error(error.message);
  console.error('\nTests cannot run without environment configuration.');
  console.error('See: docs/environment-setup.md\n');
  process.exit(1);
}
