// Type-only import validates @orpc/client dependency for Phase 1
// Actual runtime usage will be implemented in Stage 5.4
// @ts-expect-error - Unused in Phase 1 placeholder, will be used in Stage 5.4
import type { createORPCClient } from '@orpc/client';

/**
 * Configuration for the API client
 */
export interface ApiClientConfig {
  baseUrl: string;
  // Future: headers, auth tokens, etc.
}

/**
 * Placeholder API client type for Phase 1
 */
export interface ApiClient {
  baseUrl: string;
}

/**
 * Factory function to create a type-safe API client.
 *
 * PHASE 1 PLACEHOLDER: This is a minimal stub to validate package structure.
 * Stage 5.4 will implement the actual oRPC client with:
 * - Correct link configuration (httpLink or similar)
 * - Server type imports for full type safety
 * - Proper error handling and configuration
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  // Placeholder implementation - returns config for now
  // Real implementation will use @orpc/client with proper link setup
  return {
    baseUrl: config.baseUrl,
  };
}
