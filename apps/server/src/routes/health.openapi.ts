// WALKING SKELETON: Delete after infrastructure validation

import { registry } from '../openapi/registry';
import { HealthCheckListResponseSchema } from '@nx-monorepo/schemas';

/**
 * Register Health Check OpenAPI Routes
 *
 * This file defines the OpenAPI documentation for health check endpoints.
 * It follows the per-feature pattern for scalable API documentation.
 *
 * Walking skeleton validates database → server → API → web type safety.
 */
export function registerHealthOpenApi() {
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['Health'],
    summary: 'List all health check records',
    description:
      'Returns all health check records from the database, ordered by timestamp descending',
    operationId: 'getHealthChecks',
    responses: {
      200: {
        description: 'Array of health check records',
        content: {
          'application/json': {
            schema: HealthCheckListResponseSchema,
          },
        },
      },
    },
  });
}
