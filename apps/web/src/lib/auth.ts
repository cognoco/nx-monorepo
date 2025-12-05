import type { Session, User } from '@nx-monorepo/supabase-client';
import { createSupabaseServerClient } from '@nx-monorepo/supabase-client';

/**
 * Result type for auth operations that may fail.
 * Allows callers to distinguish between "no data" and "error occurred".
 */
export interface AuthResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Gets the current session from cookies (Server Components only).
 *
 * This utility is for use in Server Components, Route Handlers, and Server Actions.
 * For Client Components, use the `useAuthStateChange` hook instead.
 *
 * @returns AuthResult with session data or error
 *
 * @breaking This function signature changed in v1.x.
 * Now returns AuthResult<Session> instead of Session | null.
 * Callers must update to handle { data, error } tuple.
 *
 * @example
 * // In app/dashboard/page.tsx (Server Component)
 * import { getSession } from '@/lib/auth';
 * import { redirect } from 'next/navigation';
 *
 * export default async function DashboardPage() {
 *   const { data: session, error } = await getSession();
 *   if (error) {
 *     console.error('Auth error:', error);
 *     return <ErrorComponent />;
 *   }
 *   if (!session) {
 *     redirect('/login');
 *   }
 *   return <Dashboard user={session.user} />;
 * }
 *
 * @example
 * // In app/api/protected/route.ts (Route Handler)
 * import { getSession } from '@/lib/auth';
 * import { NextResponse } from 'next/server';
 *
 * export async function GET() {
 *   const { data: session, error } = await getSession();
 *   if (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 });
 *   }
 *   if (!session) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   return NextResponse.json({ data: 'protected' });
 * }
 */
export async function getSession(): Promise<AuthResult<Session>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: session, error: null };
}

/**
 * Gets the current user from cookies (Server Components only).
 *
 * This utility is for use in Server Components, Route Handlers, and Server Actions.
 * Internally uses `supabase.auth.getUser()` which validates the JWT token.
 * For Client Components, use the `useAuthStateChange` hook instead.
 *
 * @returns AuthResult with user data or error
 *
 * @breaking This function signature changed in v1.x.
 * Now returns AuthResult<User> instead of User | null.
 * Callers must update to handle { data, error } tuple.
 *
 * @example
 * // In app/profile/page.tsx (Server Component)
 * import { getUser } from '@/lib/auth';
 * import { redirect } from 'next/navigation';
 *
 * export default async function ProfilePage() {
 *   const { data: user, error } = await getUser();
 *   if (error) {
 *     console.error('Auth error:', error);
 *     return <ErrorComponent />;
 *   }
 *   if (!user) {
 *     redirect('/login');
 *   }
 *   return <Profile user={user} />;
 * }
 *
 * @example
 * // In app/api/user/route.ts (Route Handler)
 * import { getUser } from '@/lib/auth';
 * import { NextResponse } from 'next/server';
 *
 * export async function GET() {
 *   const { data: user, error } = await getUser();
 *   if (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 });
 *   }
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   return NextResponse.json({ user });
 * }
 */
export async function getUser(): Promise<AuthResult<User>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: user, error: null };
}
