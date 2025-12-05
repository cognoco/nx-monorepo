/**
 * @file Tests for Supabase Admin Client
 * @description Verifies environment validation, singleton pattern, and client configuration
 * for the server-side Supabase admin client.
 *
 * Key scenarios:
 * - Environment variable presence and format validation
 * - Singleton pattern ensures single client instance
 * - Server-safe configuration (no token refresh, no session persistence)
 */

import {
  getSupabaseAdmin,
  validateSupabaseServerConfig,
} from './supabase-admin.js';

// Mock the @supabase/supabase-js module
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';

describe('validateSupabaseServerConfig (validateServerEnv)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear singleton state between tests
    jest.resetModules();
    // Create a fresh copy of process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Environment Variable Presence', () => {
    it('should throw with guidance message when SUPABASE_URL is missing', () => {
      delete process.env.SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL is not defined. Add it to .env.development.local (see docs/guides/environment-setup.md). ' +
          'Note: SUPABASE_URL is preferred; NEXT_PUBLIC_SUPABASE_URL is accepted for backward compatibility.'
      );
    });

    it('should throw with guidance message when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
      process.env.SUPABASE_URL = 'https://project.supabase.co';
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is not defined. Add it to .env.development.local (see docs/guides/environment-setup.md). ' +
          'Get this from: Supabase Dashboard → Project Settings → API → service_role key (NOT anon key).'
      );
    });

    it('should throw when both environment variables are missing', () => {
      delete process.env.SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Fails on the first missing variable (URL)
      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL is not defined'
      );
    });

    it('should accept NEXT_PUBLIC_SUPABASE_URL for backward compatibility', () => {
      delete process.env.SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      const result = validateSupabaseServerConfig();

      expect(result.url).toBe('https://project.supabase.co');
    });

    it('should prefer SUPABASE_URL over NEXT_PUBLIC_SUPABASE_URL when both are set', () => {
      process.env.SUPABASE_URL = 'https://preferred.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fallback.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      const result = validateSupabaseServerConfig();

      expect(result.url).toBe('https://preferred.supabase.co');
    });
  });

  describe('URL Format Validation', () => {
    beforeEach(() => {
      // Set valid service role key for URL-only tests
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0';
    });

    it('should throw when URL is missing https:// prefix', () => {
      process.env.SUPABASE_URL = 'project.supabase.co';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL has invalid format: project.supabase.co. Expected: https://YOUR-PROJECT.supabase.co'
      );
    });

    it('should throw when URL is missing .supabase.co domain', () => {
      process.env.SUPABASE_URL = 'https://project.example.com';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL has invalid format: https://project.example.com. Expected: https://YOUR-PROJECT.supabase.co'
      );
    });

    it('should throw when URL uses http:// instead of https://', () => {
      process.env.SUPABASE_URL = 'http://project.supabase.co';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL has invalid format: http://project.supabase.co. Expected: https://YOUR-PROJECT.supabase.co'
      );
    });

    it('should pass validation for valid URL format', () => {
      process.env.SUPABASE_URL = 'https://project.supabase.co';

      const result = validateSupabaseServerConfig();

      expect(result.url).toBe('https://project.supabase.co');
      expect(result.serviceRoleKey).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0'
      );
    });

    it('should pass validation for valid URL with subdomain and path', () => {
      process.env.SUPABASE_URL = 'https://my-project-123.supabase.co';

      const result = validateSupabaseServerConfig();

      expect(result.url).toBe('https://my-project-123.supabase.co');
    });
  });

  describe('Service Role Key Format Validation', () => {
    beforeEach(() => {
      // Set valid URL for service role key tests
      process.env.SUPABASE_URL = 'https://project.supabase.co';
    });

    it('should throw when service role key does not start with "eyJ" (non-JWT format)', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'invalid-key-format';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY appears invalid. Expected a JWT token starting with "eyJ". ' +
          'Ensure you copied the service_role key (NOT the anon key) from Supabase Dashboard → Project Settings → API.'
      );
    });

    it('should throw when service role key is empty string', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = '';

      // First it will fail the "not defined" check
      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is not defined'
      );
    });

    it('should throw when service role key starts with wrong JWT header', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY appears invalid. Expected a JWT token starting with "eyJ"'
      );
    });

    it('should pass validation for valid JWT format (starts with "eyJ")', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature';

      const result = validateSupabaseServerConfig();

      expect(result.serviceRoleKey).toBe(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature'
      );
    });

    it('should pass validation for minimal JWT format', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGc';

      const result = validateSupabaseServerConfig();

      expect(result.serviceRoleKey).toBe('eyJhbGc');
    });
  });

  describe('Complete Validation Success', () => {
    it('should return both URL and service role key when all validations pass', () => {
      process.env.SUPABASE_URL = 'https://my-project.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyfQ.signature-hash';

      const result = validateSupabaseServerConfig();

      expect(result).toEqual({
        url: 'https://my-project.supabase.co',
        serviceRoleKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyfQ.signature-hash',
      });
    });
  });
});

describe('getSupabaseAdmin', () => {
  const originalEnv = process.env;
  const mockCreateClient = createClient as jest.MockedFunction<
    typeof createClient
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a fresh copy of process.env
    process.env = { ...originalEnv };

    // Set valid environment variables by default
    process.env.SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.test-signature';
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    // Reset the module to clear singleton state for next test
    jest.resetModules();
  });

  describe('Singleton Pattern and Configuration', () => {
    it('should initialize Supabase client on first call with correct configuration and return same instance on subsequent calls', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockClient = {} as any;
      mockCreateClient.mockReturnValue(mockClient);

      // First call - should initialize with correct configuration
      const client1 = getSupabaseAdmin();
      expect(mockCreateClient).toHaveBeenCalledTimes(1);
      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test-project.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.test-signature',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
      expect(client1).toBe(mockClient);

      // Verify configuration
      const callArgs = mockCreateClient.mock.calls[0];
      expect(callArgs[2]).toHaveProperty('auth.autoRefreshToken', false);
      expect(callArgs[2]).toHaveProperty('auth.persistSession', false);

      // Second call - should return same instance
      const client2 = getSupabaseAdmin();
      expect(mockCreateClient).toHaveBeenCalledTimes(1); // Still only called once
      expect(client2).toBe(client1); // Same instance

      // Multiple subsequent calls - still same instance
      const client3 = getSupabaseAdmin();
      const client4 = getSupabaseAdmin();
      expect(mockCreateClient).toHaveBeenCalledTimes(1); // Still only called once
      expect(client3).toBe(client1);
      expect(client4).toBe(client1);
    });
  });

  describe('Error Handling', () => {
    it('should throw when environment validation fails (missing URL)', () => {
      // Clear environment before validation
      delete process.env.SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      // Use validateSupabaseServerConfig instead of getSupabaseAdmin to test validation
      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL is not defined'
      );
    });

    it('should throw when environment validation fails (missing service role key)', () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY is not defined'
      );
    });

    it('should throw when environment validation fails (invalid URL format)', () => {
      process.env.SUPABASE_URL = 'http://invalid.example.com';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_URL has invalid format'
      );
    });

    it('should throw when environment validation fails (invalid service role key format)', () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'not-a-jwt-token';

      expect(() => validateSupabaseServerConfig()).toThrow(
        'SUPABASE_SERVICE_ROLE_KEY appears invalid'
      );
    });
  });
});
