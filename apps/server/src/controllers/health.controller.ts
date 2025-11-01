// WALKING SKELETON: Delete after infrastructure validation

import { Request, Response } from 'express';
import { getHealthChecks } from '@nx-monorepo/database';
import type { HealthCheckListResponse } from '@nx-monorepo/schemas';

/**
 * Health check controller
 * Handles HTTP request/response for health check endpoints
 * Purpose: Validate database → server → API flow with end-to-end type safety
 */
export const healthController = {
  /**
   * Get all health checks from database
   * Returns list of health check records ordered by timestamp descending
   */
  async check(_req: Request, res: Response): Promise<void> {
    try {
      // Fetch health checks from database via Prisma
      const records = await getHealthChecks();

      // Transform Prisma records to API response format
      // Convert Date objects to ISO 8601 strings for JSON serialization
      const response: HealthCheckListResponse = {
        healthChecks: records.map((record) => ({
          id: record.id,
          message: record.message,
          timestamp: record.timestamp.toISOString(),
        })),
      };

      res.json(response);
    } catch (error) {
      // Basic error handling for Phase 1 (no comprehensive error middleware yet)
      console.error('Error fetching health checks:', error);
      res.status(500).json({
        error: 'InternalServerError',
        message: 'Failed to fetch health checks from database',
      });
    }
  },
};
