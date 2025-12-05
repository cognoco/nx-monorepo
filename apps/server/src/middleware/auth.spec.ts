import { Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import {
  extractBearerToken,
  validateToken,
  requireAuth,
  AuthenticatedRequest,
} from './auth.js';

// Mock the supabase-admin module
jest.mock('../lib/supabase-admin.js', () => ({
  getSupabaseAdmin: jest.fn(),
}));

import { getSupabaseAdmin } from '../lib/supabase-admin.js';

describe('extractBearerToken', () => {
  it('should extract token from valid Bearer header', () => {
    const token = extractBearerToken(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should extract token from lowercase "bearer" header (case-insensitive)', () => {
    const token = extractBearerToken(
      'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should extract token from mixed case "Bearer" header', () => {
    const token = extractBearerToken(
      'BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('should return null for undefined header', () => {
    const token = extractBearerToken(undefined);
    expect(token).toBeNull();
  });

  it('should return null for missing "Bearer" prefix', () => {
    const token = extractBearerToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    expect(token).toBeNull();
  });

  it('should return null for malformed header with only "Bearer"', () => {
    const token = extractBearerToken('Bearer');
    expect(token).toBeNull();
  });

  it('should return null for empty string header', () => {
    const token = extractBearerToken('');
    expect(token).toBeNull();
  });

  it('should return null for header with wrong prefix', () => {
    const token = extractBearerToken(
      'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
    expect(token).toBeNull();
  });

  it('should handle token with multiple spaces after Bearer', () => {
    const token = extractBearerToken(
      'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    );
    // Regex uses \s+ so multiple spaces are acceptable
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });
});

describe('validateToken', () => {
  const mockGetSupabaseAdmin = getSupabaseAdmin as jest.MockedFunction<
    typeof getSupabaseAdmin
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user object for valid token', async () => {
    const mockUser: User = {
      id: 'user-123',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'test@example.com',
      email_confirmed_at: '2025-01-01T00:00:00Z',
      phone: '',
      confirmed_at: '2025-01-01T00:00:00Z',
      last_sign_in_at: '2025-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    // Use properly formatted JWT token (3 parts separated by dots)
    const user = await validateToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyJ9.signature'
    );
    expect(user).toEqual(mockUser);
    expect(mockGetSupabaseAdmin).toHaveBeenCalledTimes(1);
  });

  it('should return null for invalid token (error response)', async () => {
    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
    } as any);

    // Use properly formatted JWT token that Supabase rejects
    const user = await validateToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnZhbGlkIn0.invalid'
    );
    expect(user).toBeNull();
  });

  it('should return null when user is null in response', async () => {
    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as any);

    // Use properly formatted JWT token that returns null user
    const user = await validateToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.expired'
    );
    expect(user).toBeNull();
  });

  it('should return null when getUser throws an error', async () => {
    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockRejectedValue(new Error('Network error')),
      },
    } as any);

    // Use properly formatted JWT token that triggers network error
    const user = await validateToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZXR3b3JrIn0.error'
    );
    expect(user).toBeNull();
  });

  it('should return null for malformed token without dots (not JWT format)', async () => {
    const user = await validateToken('not-a-jwt');
    expect(user).toBeNull();
    // Supabase should not be called for malformed tokens
    expect(mockGetSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('should return null for empty string token', async () => {
    const user = await validateToken('');
    expect(user).toBeNull();
    expect(mockGetSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('should return null for token with only 2 parts', async () => {
    const user = await validateToken('only.two');
    expect(user).toBeNull();
    expect(mockGetSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('should return null for token with 4 parts', async () => {
    const user = await validateToken('one.two.three.four');
    expect(user).toBeNull();
    expect(mockGetSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('should return null for valid JWT format but invalid token (Supabase rejects)', async () => {
    // Token has valid JWT format (3 parts) but Supabase rejects it
    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid JWT' },
        }),
      },
    } as any);

    const user = await validateToken('eyJhbGc.eyJzdWI.SflKxwRJ');
    expect(user).toBeNull();
    // Supabase should be called for tokens with valid format
    expect(mockGetSupabaseAdmin).toHaveBeenCalledTimes(1);
  });

  it('should reject token with invalid base64url characters', async () => {
    // Token with invalid characters (+ and / instead of - and _)
    const user = await validateToken('eyJhbGc+.eyJzdWI/.SflKxwRJ');
    expect(user).toBeNull();
    expect(mockGetSupabaseAdmin).not.toHaveBeenCalled();
  });
});

describe('requireAuth middleware', () => {
  const mockGetSupabaseAdmin = getSupabaseAdmin as jest.MockedFunction<
    typeof getSupabaseAdmin
  >;

  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();
  });

  it('should attach user to request and call next() for valid authentication', async () => {
    const mockUser: User = {
      id: 'user-123',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'test@example.com',
      email_confirmed_at: '2025-01-01T00:00:00Z',
      phone: '',
      confirmed_at: '2025-01-01T00:00:00Z',
      last_sign_in_at: '2025-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    // Use properly formatted JWT token
    mockRequest.headers = {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyJ9.signature',
    };

    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any);

    await requireAuth(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockRequest.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return 401 AUTH_REQUIRED when Authorization header is missing', async () => {
    mockRequest.headers = {};

    await requireAuth(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Unauthorized',
      code: 'AUTH_REQUIRED',
      details:
        'Valid JWT token required in Authorization header (format: "Bearer <token>")',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 AUTH_REQUIRED when Authorization header is malformed', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat',
    };

    await requireAuth(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Unauthorized',
      code: 'AUTH_REQUIRED',
      details:
        'Valid JWT token required in Authorization header (format: "Bearer <token>")',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 INVALID_TOKEN when token validation fails', async () => {
    // Use properly formatted JWT token that Supabase rejects
    mockRequest.headers = {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnZhbGlkIn0.invalid',
    };

    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
    } as any);

    await requireAuth(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Unauthorized',
      code: 'INVALID_TOKEN',
      details: 'JWT token is invalid or expired',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 INVALID_TOKEN when Supabase returns null user', async () => {
    // Use properly formatted JWT token that returns null user
    mockRequest.headers = {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.expired',
    };

    mockGetSupabaseAdmin.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as any);

    await requireAuth(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Unauthorized',
      code: 'INVALID_TOKEN',
      details: 'JWT token is invalid or expired',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
