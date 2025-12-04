/**
 * Unit tests for authentication utilities and hooks.
 *
 * These tests verify:
 * - Server-side session/user retrieval (auth.ts)
 * - Client-side auth state subscription hook (auth-hooks.ts)
 */

import { renderHook, waitFor } from '@testing-library/react';

// Mock Supabase client before imports
const mockGetSession = jest.fn();
const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@nx-monorepo/supabase-client', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      getSession: mockGetSession,
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  })),
  createSupabaseServerClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        getSession: mockGetSession,
        getUser: mockGetUser,
      },
    })
  ),
}));

// Import after mocking
import { getSession, getUser } from './auth';
import { useAuthStateChange } from './auth-hooks';

describe('Server Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getSession', () => {
    it('should return session when authentication is successful', async () => {
      // Arrange
      const mockSession = {
        access_token: 'test-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      // Act
      const session = await getSession();

      // Assert
      expect(session).toEqual(mockSession);
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });

    it('should return null when no session exists', async () => {
      // Arrange
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      // Act
      const session = await getSession();

      // Assert
      expect(session).toBeNull();
      expect(mockGetSession).toHaveBeenCalledTimes(1);
    });

    it('should return null and log error when getSession fails', async () => {
      // Arrange
      const mockError = { message: 'Auth service unavailable' };
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: mockError,
      });

      // Act
      const session = await getSession();

      // Assert
      expect(session).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error getting session:',
        'Auth service unavailable'
      );
    });
  });

  describe('getUser', () => {
    it('should return user when authentication is successful', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      // Act
      const user = await getUser();

      // Assert
      expect(user).toEqual(mockUser);
      expect(mockGetUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when no user is authenticated', async () => {
      // Arrange
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      // Act
      const user = await getUser();

      // Assert
      expect(user).toBeNull();
      expect(mockGetUser).toHaveBeenCalledTimes(1);
    });

    it('should return null and log error when getUser fails', async () => {
      // Arrange
      const mockError = { message: 'Invalid JWT token' };
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      // Act
      const user = await getUser();

      // Assert
      expect(user).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error getting user:',
        'Invalid JWT token'
      );
    });
  });
});

describe('Client Auth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  describe('useAuthStateChange', () => {
    it('should initialize with loading state', () => {
      // Arrange
      mockGetSession.mockReturnValueOnce(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        new Promise(() => {})
      ); // Never resolves

      // Act
      const { result } = renderHook(() => useAuthStateChange());

      // Assert
      expect(result.current).toEqual({
        user: null,
        session: null,
        loading: true,
      });
    });

    it('should set authenticated state when session exists', async () => {
      // Arrange
      const mockSession = {
        access_token: 'test-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
      });

      // Act
      const { result } = renderHook(() => useAuthStateChange());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toEqual({
        user: mockSession.user,
        session: mockSession,
        loading: false,
      });
    });

    it('should set unauthenticated state when no session exists', async () => {
      // Arrange
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      // Act
      const { result } = renderHook(() => useAuthStateChange());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toEqual({
        user: null,
        session: null,
        loading: false,
      });
    });

    it('should subscribe to auth state changes', async () => {
      // Arrange
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      // Act
      renderHook(() => useAuthStateChange());

      // Assert
      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
      });

      expect(mockOnAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should update state when auth state changes', async () => {
      // Arrange
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let authCallback: (event: string, session: any) => void;
      mockOnAuthStateChange.mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (callback: (event: string, session: any) => void) => {
          authCallback = callback;
          return {
            data: { subscription: { unsubscribe: mockUnsubscribe } },
          };
        }
      );

      // Act
      const { result } = renderHook(() => useAuthStateChange());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate sign in
      const newSession = {
        access_token: 'new-token',
        user: {
          id: 'user-456',
          email: 'newuser@example.com',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      authCallback!('SIGNED_IN', newSession);

      // Assert
      await waitFor(() => {
        expect(result.current.user).toEqual(newSession.user);
      });

      expect(result.current).toEqual({
        user: newSession.user,
        session: newSession,
        loading: false,
      });
    });

    it('should update state to null when user signs out', async () => {
      // Arrange
      const mockSession = {
        access_token: 'test-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let authCallback: (event: string, session: any) => void;
      mockOnAuthStateChange.mockImplementationOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (callback: (event: string, session: any) => void) => {
          authCallback = callback;
          return {
            data: { subscription: { unsubscribe: mockUnsubscribe } },
          };
        }
      );

      // Act
      const { result } = renderHook(() => useAuthStateChange());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockSession.user);
      });

      // Simulate sign out
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      authCallback!('SIGNED_OUT', null);

      // Assert
      await waitFor(() => {
        expect(result.current.user).toBeNull();
      });

      expect(result.current).toEqual({
        user: null,
        session: null,
        loading: false,
      });
    });

    it('should unsubscribe from auth changes on unmount', async () => {
      // Arrange
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      // Act
      const { unmount } = renderHook(() => useAuthStateChange());

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Assert
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
