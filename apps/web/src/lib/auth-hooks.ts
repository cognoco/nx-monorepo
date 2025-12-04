'use client';

import { useEffect, useState } from 'react';
import type {
  Session,
  User,
  AuthChangeEvent,
} from '@nx-monorepo/supabase-client';
import { createSupabaseBrowserClient } from '@nx-monorepo/supabase-client';

/**
 * Auth state returned by the `useAuthStateChange` hook.
 */
export interface AuthState {
  /** The current authenticated user, or null if not authenticated */
  user: User | null;
  /** The current session, or null if not authenticated */
  session: Session | null;
  /** True while initial session fetch is in progress */
  loading: boolean;
}

/**
 * React hook for subscribing to authentication state changes in Client Components.
 *
 * This hook automatically subscribes to Supabase auth events and updates when:
 * - User signs in
 * - User signs out
 * - Session is refreshed
 * - Token expires
 *
 * The subscription is automatically cleaned up when the component unmounts.
 *
 * @returns AuthState object with user, session, and loading status
 *
 * @example
 * // In app/components/AuthProvider.tsx (Client Component)
 * 'use client';
 * import { useAuthStateChange } from '@/lib/auth-hooks';
 *
 * export function AuthProvider({ children }: { children: React.ReactNode }) {
 *   const { user, session, loading } = useAuthStateChange();
 *
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return (
 *     <AuthContext.Provider value={{ user, session }}>
 *       {children}
 *     </AuthContext.Provider>
 *   );
 * }
 *
 * @example
 * // In app/components/UserProfile.tsx (Client Component)
 * 'use client';
 * import { useAuthStateChange } from '@/lib/auth-hooks';
 *
 * export function UserProfile() {
 *   const { user, loading } = useAuthStateChange();
 *
 *   if (loading) return <Spinner />;
 *   if (!user) return <div>Please sign in</div>;
 *
 *   return <div>Hello, {user.email}</div>;
 * }
 */
export function useAuthStateChange(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
