import type { Session, User } from '@nx-monorepo/supabase-client';
import { createSupabaseServerClient } from '@nx-monorepo/supabase-client';

/**
 * Gets the current session from cookies (Server Components only).
 *
 * This utility is for use in Server Components, Route Handlers, and Server Actions.
 * For Client Components, use the `useAuthStateChange` hook instead.
 *
 * @returns The current session or null if not authenticated
 *
 * @example
 * // In app/dashboard/page.tsx (Server Component)
 * import { getSession } from '@/lib/auth';
 * import { redirect } from 'next/navigation';
 *
 * export default async function DashboardPage() {
 *   const session = await getSession();
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
 *   const session = await getSession();
 *   if (!session) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   return NextResponse.json({ data: 'protected' });
 * }
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }

  return session;
}

/**
 * Gets the current user from cookies (Server Components only).
 *
 * This utility is for use in Server Components, Route Handlers, and Server Actions.
 * Internally uses `supabase.auth.getUser()` which validates the JWT token.
 * For Client Components, use the `useAuthStateChange` hook instead.
 *
 * @returns The current user or null if not authenticated
 *
 * @example
 * // In app/profile/page.tsx (Server Component)
 * import { getUser } from '@/lib/auth';
 * import { redirect } from 'next/navigation';
 *
 * export default async function ProfilePage() {
 *   const user = await getUser();
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
 *   const user = await getUser();
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   return NextResponse.json({ user });
 * }
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }

  return user;
}
