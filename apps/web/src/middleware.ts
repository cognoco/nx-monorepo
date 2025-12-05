import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for route protection and authentication.
 *
 * ⚠️ DISABLED FOR PHASE 1 ⚠️
 * This middleware is configured but not active. The matcher is set to an empty array,
 * which means no routes will trigger this middleware.
 *
 * Enable in Phase 2 by updating config.matcher with protected route patterns.
 *
 * @example
 * // Phase 2: Enable middleware by updating matcher
 * export const config = {
 *   matcher: [
 *     '/dashboard/:path*',
 *     '/profile/:path*',
 *     '/settings/:path*',
 *   ],
 * };
 */
export async function middleware(request: NextRequest) {
  // Phase 2: Uncomment auth logic below
  //
  // const supabase = await createSupabaseServerClient();
  // const { data: { session } } = await supabase.auth.getSession();
  //
  // const pathname = request.nextUrl.pathname;
  //
  // // Redirect unauthenticated users from protected routes to login
  // if (!session && isProtectedRoute(pathname)) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('redirectTo', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  //
  // // Redirect authenticated users from auth pages to dashboard
  // if (session && isAuthRoute(pathname)) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

/**
 * Route classification helpers (for Phase 2).
 *
 * These helpers categorize routes to determine authentication requirements.
 */

/**
 * Routes that require authentication.
 * Unauthenticated users will be redirected to /login.
 */
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

/**
 * Authentication pages (login, signup, password reset).
 * Authenticated users will be redirected to /dashboard.
 */
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

/**
 * Checks if a pathname requires authentication.
 *
 * @param pathname - The request pathname
 * @returns True if the route requires authentication
 *
 * @example
 * isProtectedRoute('/dashboard') // true
 * isProtectedRoute('/dashboard/settings') // true
 * isProtectedRoute('/') // false
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Checks if a pathname is an authentication page.
 *
 * @param pathname - The request pathname
 * @returns True if the route is an auth page
 *
 * @example
 * isAuthRoute('/login') // true
 * isAuthRoute('/signup') // true
 * isAuthRoute('/dashboard') // false
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Middleware configuration.
 *
 * PHASE 1 (current): matcher = [] (middleware DISABLED)
 * PHASE 2 (future): Update matcher to enable route protection
 *
 * @example
 * // Phase 2: Enable for protected routes
 * export const config = {
 *   matcher: [
 *     '/dashboard/:path*',
 *     '/profile/:path*',
 *     '/settings/:path*',
 *   ],
 * };
 */
export const config = {
  matcher: [], // Empty = DISABLED for Phase 1
};
