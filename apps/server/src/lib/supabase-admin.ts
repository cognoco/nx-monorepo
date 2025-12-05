import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates presence and format of server-side Supabase environment variables.
 * Returns the URL and service role key or throws with actionable guidance.
 *
 * @throws {Error} If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing or invalid
 * @returns Object containing validated URL and service role key
 *
 * @example
 * ```typescript
 * const { url, serviceRoleKey } = validateServerEnv();
 * // { url: 'https://xxxxx.supabase.co', serviceRoleKey: 'eyJhbG...' }
 * ```
 */
function validateServerEnv(): { url: string; serviceRoleKey: string } {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'SUPABASE_URL is not defined. Add it to .env.development.local (see docs/guides/environment-setup.md). ' +
        'Note: SUPABASE_URL is preferred; NEXT_PUBLIC_SUPABASE_URL is accepted for backward compatibility.'
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not defined. Add it to .env.development.local (see docs/guides/environment-setup.md). ' +
        'Get this from: Supabase Dashboard → Project Settings → API → service_role key (NOT anon key).'
    );
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    throw new Error(
      `SUPABASE_URL has invalid format: ${url}. Expected: https://YOUR-PROJECT.supabase.co`
    );
  }

  // Basic validation for service role key format (JWT)
  if (!serviceRoleKey.startsWith('eyJ')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY appears invalid. Expected a JWT token starting with "eyJ". ' +
        'Ensure you copied the service_role key (NOT the anon key) from Supabase Dashboard → Project Settings → API.'
    );
  }

  return { url, serviceRoleKey };
}

/**
 * Singleton instance of the Supabase admin client.
 * Initialized lazily on first access.
 */
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Creates or returns the singleton Supabase admin client for server-side operations.
 * Uses service role key for elevated permissions (bypasses RLS).
 *
 * **IMPORTANT**: This client has full database access and should only be used server-side.
 * Never expose the service role key or this client to the browser.
 *
 * Configuration:
 * - autoRefreshToken: false (server-side clients don't need token refresh)
 * - persistSession: false (no session storage on server)
 *
 * @throws {Error} If environment variables are missing or invalid
 * @returns {SupabaseClient} Configured Supabase admin client
 *
 * @example
 * ```typescript
 * import { getSupabaseAdmin } from '../lib/supabase-admin.js';
 *
 * // Validate JWT token
 * const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
 * if (error || !user) {
 *   return res.status(401).json({ error: 'Invalid token' });
 * }
 *
 * // User is authenticated
 * console.log(user.id, user.email);
 * ```
 */
export function getSupabaseAdmin(): SupabaseClient {
  // Singleton pattern: initialize once and reuse
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const { url, serviceRoleKey } = validateServerEnv();

  supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

/**
 * Exported helper to validate server-side Supabase configuration.
 * Useful for startup health checks and diagnostics.
 *
 * @throws {Error} If environment variables are missing or invalid
 * @returns Object containing validated environment variables
 *
 * @example
 * ```typescript
 * import { validateSupabaseServerConfig } from './lib/supabase-admin.js';
 *
 * // Health check endpoint
 * app.get('/health', (req, res) => {
 *   try {
 *     validateSupabaseServerConfig();
 *     res.json({ status: 'ok', supabase: 'configured' });
 *   } catch (error) {
 *     res.status(500).json({ status: 'error', message: error.message });
 *   }
 * });
 * ```
 */
export { validateServerEnv as validateSupabaseServerConfig };
