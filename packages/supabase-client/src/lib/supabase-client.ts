// Empty type imports validate Supabase dependencies for Phase 1
// Actual runtime usage will be implemented in Stage 4.5
import type {} from '@supabase/ssr';
import type {} from '@supabase/supabase-js';

/**
 * Configuration for Supabase client
 */
export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

/**
 * Placeholder Supabase client type for Phase 1
 */
export interface SupabaseClientInstance {
  url: string;
}

/**
 * Factory function to create a browser-side Supabase client.
 *
 * PHASE 1 PLACEHOLDER: This is a minimal stub to validate package structure.
 * Stage 4.5 will implement the actual Supabase client with:
 * - @supabase/ssr for Next.js Server Components and Client Components
 * - Proper authentication handling
 * - Cookie management for session persistence
 */
export function createSupabaseBrowserClient(
  config: SupabaseClientConfig
): SupabaseClientInstance {
  // Placeholder implementation - returns config for now
  // Real implementation will use @supabase/ssr createBrowserClient
  return {
    url: config.supabaseUrl,
  };
}

/**
 * Factory function to create a server-side Supabase client.
 *
 * PHASE 1 PLACEHOLDER: This is a minimal stub to validate package structure.
 * Stage 4.5 will implement the actual Supabase client with:
 * - @supabase/ssr for Next.js Server Components and Route Handlers
 * - Proper cookie handling via Next.js cookies()
 * - Session management
 */
export function createSupabaseServerClient(
  config: SupabaseClientConfig
): SupabaseClientInstance {
  // Placeholder implementation - returns config for now
  // Real implementation will use @supabase/ssr createServerClient
  return {
    url: config.supabaseUrl,
  };
}
