/**
 * Jest Setup File - Server Application
 *
 * Loads environment variables required for server tests:
 * - DATABASE_URL (Supabase connection string)
 * - DIRECT_URL (Direct Prisma connection)
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Mocks external services:
 * - Sentry (@sentry/node) - Prevents actual error reporting during tests
 *
 * @see docs/project-config/supabase.md for environment configuration
 * @see docs/memories/testing-reference.md for testing guidelines
 */

import { loadDatabaseEnv } from '@nx-monorepo/test-utils';
import { resolve } from 'path';
import type { Application, Request, Response, NextFunction } from 'express';

// Load database environment variables for tests
// Use __dirname (not process.cwd()) to ensure correct path resolution
// __dirname = apps/server, so ../.. = workspace root
loadDatabaseEnv(resolve(__dirname, '../..'));

// Mock Sentry globally for all tests
// This prevents actual error reporting and network calls during tests
// Note: Sentry v8+ uses setupExpressErrorHandler instead of Handlers.*
jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  // v8+ API: Single function instead of Handlers object
  setupExpressErrorHandler: jest.fn((app: Application) => {
    // Add a mock error handler middleware to the app
    app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }),
}));
