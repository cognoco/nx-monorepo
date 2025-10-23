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
 * PLACEHOLDER: Will be replaced with REST+OpenAPI client using generated types.
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  // Placeholder implementation - returns config for now
  return {
    baseUrl: config.baseUrl,
  };
}
