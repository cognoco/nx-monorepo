import { registerHealthOpenApi } from '../routes/health.openapi';

/**
 * OpenAPI Initialization Guard
 *
 * Prevents double-registration of OpenAPI routes.
 */
let initialized = false;

/**
 * Initialize OpenAPI Registry
 *
 * Aggregates all feature OpenAPI registrations.
 * Uses an init guard to prevent double-registration.
 *
 * This function should be called once at application startup
 * before generating the OpenAPI document.
 */
export function initOpenApi() {
  if (initialized) return;
  initialized = true;

  // Register all feature OpenAPI paths
  registerHealthOpenApi();
}
