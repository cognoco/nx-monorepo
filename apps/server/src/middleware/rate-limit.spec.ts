/**
 * @file Tests for Rate Limiting Middleware
 * @description Verifies rate limiting behavior for general API, authentication, and sensitive operations.
 *
 * Key scenarios:
 * - Default rate limiter: 100 requests per 15 minutes for general API endpoints
 * - Auth rate limiter: 10 requests per 15 minutes for authentication endpoints
 * - Sensitive rate limiter: 5 requests per 1 hour for sensitive operations
 * - Standard rate limit headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
 * - Consistent error response format across all limiters
 */

import express, { Express } from 'express';
import request from 'supertest';
import {
  defaultRateLimiter,
  authRateLimiter,
  sensitiveRateLimiter,
  createRateLimiter,
} from './rate-limit.js';

describe('Rate Limiting Middleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
  });

  describe('defaultRateLimiter', () => {
    beforeEach(() => {
      app.use(defaultRateLimiter);
      app.get('/test', (req, res) => {
        res.json({ success: true });
      });
    });

    it('should allow requests under the limit', async () => {
      const response = await request(app).get('/test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should set rate limit headers on response', async () => {
      const response = await request(app).get('/test');

      // express-rate-limit sets standard headers
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should block requests after exceeding limit', async () => {
      // Use custom limiter with low limit for fast testing
      const testApp = express();
      const testLimiter = createRateLimiter({ max: 3 });
      testApp.use(testLimiter);
      testApp.get('/test', (req, res) => res.json({ success: true }));

      // Make 3 requests (test limit)
      for (let i = 0; i < 3; i++) {
        await request(testApp).get('/test');
      }

      // 4th request should be blocked
      const response = await request(testApp).get('/test');

      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        error: 'Too Many Requests',
        code: 'RATE_LIMIT_EXCEEDED',
        details: 'Too many requests from this IP, please try again later',
      });
    });
  });

  describe('authRateLimiter', () => {
    beforeEach(() => {
      app.use(authRateLimiter);
      app.post('/auth/login', (req, res) => {
        res.json({ token: 'fake-jwt-token' });
      });
    });

    it('should allow requests under the strict limit', async () => {
      const response = await request(app).post('/auth/login');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'fake-jwt-token' });
    });

    it('should set standard rate limit headers', async () => {
      const response = await request(app).post('/auth/login');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should not set legacy X-RateLimit-* headers', async () => {
      const response = await request(app).post('/auth/login');

      const headerKeys = Object.keys(response.headers);
      const hasLegacyHeaders = headerKeys.some((key) =>
        key.toLowerCase().startsWith('x-ratelimit-')
      );

      expect(hasLegacyHeaders).toBe(false);
    });

    it('should block after 10 authentication attempts', async () => {
      // Make 10 requests (auth limit is 10)
      for (let i = 0; i < 10; i++) {
        await request(app).post('/auth/login');
      }

      // 11th request should be blocked
      const response = await request(app).post('/auth/login');

      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        error: 'Too Many Requests',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        details: 'Too many authentication attempts, please try again later',
      });
    });

    it('should have stricter limits than default limiter', async () => {
      // Use custom limiters for fast comparison testing
      const defaultApp = express();
      const authApp = express();

      // Create limiters with smaller limits for testing (5 vs 3)
      const testDefaultLimiter = createRateLimiter({ max: 5 });
      const testAuthLimiter = createRateLimiter({
        max: 3,
        message: {
          error: 'Too Many Requests',
          code: 'AUTH_RATE_LIMIT_EXCEEDED',
          details: 'Too many authentication attempts, please try again later',
        },
      });

      defaultApp.use(testDefaultLimiter);
      defaultApp.get('/test', (req, res) => res.json({ ok: true }));

      authApp.use(testAuthLimiter);
      authApp.post('/auth/login', (req, res) => res.json({ ok: true }));

      // Auth limiter (3) should block before default (5)
      for (let i = 0; i < 3; i++) {
        await request(authApp).post('/auth/login');
      }
      const authResponse = await request(authApp).post('/auth/login');
      expect(authResponse.status).toBe(429);

      // Default should still allow requests at same count
      for (let i = 0; i < 3; i++) {
        await request(defaultApp).get('/test');
      }
      const defaultResponse = await request(defaultApp).get('/test');
      expect(defaultResponse.status).toBe(200);
    });
  });

  describe('sensitiveRateLimiter', () => {
    beforeEach(() => {
      app.use(sensitiveRateLimiter);
      app.post('/account/delete', (req, res) => {
        res.json({ deleted: true });
      });
    });

    it('should allow requests under the very strict limit', async () => {
      const response = await request(app).post('/account/delete');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ deleted: true });
    });

    it('should set standard rate limit headers', async () => {
      const response = await request(app).post('/account/delete');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });

    it('should block after 5 sensitive operation attempts', async () => {
      // Make 5 requests (sensitive limit is 5)
      for (let i = 0; i < 5; i++) {
        await request(app).post('/account/delete');
      }

      // 6th request should be blocked
      const response = await request(app).post('/account/delete');

      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        error: 'Too Many Requests',
        code: 'SENSITIVE_RATE_LIMIT_EXCEEDED',
        details:
          'Too many sensitive operation attempts, please try again later',
      });
    });

    it('should have the strictest limits', async () => {
      // Sensitive limiter blocks at 6 requests (limit 5)
      // Auth would allow 10, default would allow 100
      for (let i = 0; i < 5; i++) {
        await request(app).post('/account/delete');
      }

      const response = await request(app).post('/account/delete');
      expect(response.status).toBe(429);
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error format across all limiters', async () => {
      const testCases = [
        {
          setupApp: () => {
            const testApp = express();
            testApp.use(defaultRateLimiter);
            testApp.get('/test', (req, res) => res.json({ ok: true }));
            return testApp;
          },
          limit: 100,
          expectedCode: 'RATE_LIMIT_EXCEEDED',
        },
        {
          setupApp: () => {
            const testApp = express();
            testApp.use(authRateLimiter);
            testApp.post('/test', (req, res) => res.json({ ok: true }));
            return testApp;
          },
          limit: 10,
          expectedCode: 'AUTH_RATE_LIMIT_EXCEEDED',
        },
        {
          setupApp: () => {
            const testApp = express();
            testApp.use(sensitiveRateLimiter);
            testApp.delete('/test', (req, res) => res.json({ ok: true }));
            return testApp;
          },
          limit: 5,
          expectedCode: 'SENSITIVE_RATE_LIMIT_EXCEEDED',
        },
      ];

      for (const testCase of testCases) {
        const testApp = testCase.setupApp();

        // Exceed the limit
        for (let i = 0; i < testCase.limit; i++) {
          if (testCase.expectedCode === 'RATE_LIMIT_EXCEEDED') {
            await request(testApp).get('/test');
          } else if (testCase.expectedCode === 'AUTH_RATE_LIMIT_EXCEEDED') {
            await request(testApp).post('/test');
          } else {
            await request(testApp).delete('/test');
          }
        }

        // Next request should be blocked
        let response;
        if (testCase.expectedCode === 'RATE_LIMIT_EXCEEDED') {
          response = await request(testApp).get('/test');
        } else if (testCase.expectedCode === 'AUTH_RATE_LIMIT_EXCEEDED') {
          response = await request(testApp).post('/test');
        } else {
          response = await request(testApp).delete('/test');
        }

        // Verify error format
        expect(response.status).toBe(429);
        expect(response.body).toMatchObject({
          error: 'Too Many Requests',
          code: testCase.expectedCode,
          details: expect.any(String),
        });
      }
    });

    it('should include descriptive error details', async () => {
      const testApp = express();
      testApp.use(authRateLimiter);
      testApp.post('/login', (req, res) => res.json({ token: 'xyz' }));

      // Exceed auth limit
      for (let i = 0; i < 10; i++) {
        await request(testApp).post('/login');
      }

      const response = await request(testApp).post('/login');

      expect(response.body.details).toContain('authentication');
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include rate limit headers', async () => {
      // Create isolated app instance
      const testApp = express();
      testApp.use(defaultRateLimiter);
      testApp.get('/test', (req, res) => res.json({ ok: true }));

      const response = await request(testApp)
        .get('/test')
        .set('X-Forwarded-For', '100.100.100.1');

      // Verify standard headers are present
      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });

    it('should not include legacy X-RateLimit headers', async () => {
      // Create isolated app instance
      const testApp = express();
      testApp.use(defaultRateLimiter);
      testApp.get('/test', (req, res) => res.json({ ok: true }));

      const response = await request(testApp)
        .get('/test')
        .set('X-Forwarded-For', '101.101.101.1');

      const headerKeys = Object.keys(response.headers);
      const hasLegacyHeaders = headerKeys.some((key) =>
        key.toLowerCase().startsWith('x-ratelimit-')
      );

      expect(hasLegacyHeaders).toBe(false);
    });

    it('should include numeric rate limit values', async () => {
      // Create isolated app instance
      const testApp = express();
      testApp.use(authRateLimiter);
      testApp.get('/test', (req, res) => res.json({ ok: true }));

      const response = await request(testApp)
        .get('/test')
        .set('X-Forwarded-For', '102.102.102.1');

      const limit = parseInt(response.headers['ratelimit-limit'] as string, 10);
      const remaining = parseInt(
        response.headers['ratelimit-remaining'] as string,
        10
      );
      const reset = parseInt(response.headers['ratelimit-reset'] as string, 10);

      // Verify values are valid numbers
      expect(Number.isNaN(limit)).toBe(false);
      expect(Number.isNaN(remaining)).toBe(false);
      expect(Number.isNaN(reset)).toBe(false);

      // Verify reasonable values
      expect(limit).toBeGreaterThan(0);
      expect(remaining).toBeGreaterThanOrEqual(0);
      expect(reset).toBeGreaterThan(0);
    });
  });
});
