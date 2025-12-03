/**
 * Jest Setup File - Server Application
 *
 * Loads environment variables required for server tests:
 * - DATABASE_URL (Supabase connection string)
 * - DIRECT_URL (Direct Prisma connection)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * @see docs/project-config/supabase.md for environment configuration
 * @see docs/memories/testing-reference.md for testing guidelines
 */

import { loadDatabaseEnv } from '@nx-monorepo/test-utils';
import { resolve } from 'path';

// Load database environment variables for tests
// Use __dirname (not process.cwd()) to ensure correct path resolution
// __dirname = apps/server, so ../.. = workspace root
loadDatabaseEnv(resolve(__dirname, '../..'));
