/**
 * Rate limiting middleware for Express.
 * Protects against brute force and DDoS attacks.
 *
 * @module middleware/rate-limit
 */

import rateLimit, { type Options } from 'express-rate-limit';

/**
 * Creates a rate limiter with custom configuration.
 * Useful for testing or custom rate limiting scenarios.
 *
 * @param options - Partial rate limit options to override defaults
 * @returns Configured rate limiter middleware
 */
export function createRateLimiter(options: Partial<Options> = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      error: 'Too Many Requests',
      code: 'RATE_LIMIT_EXCEEDED',
      details: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
}

/**
 * Default rate limiter for general API endpoints.
 * Allows 100 requests per 15 minutes per IP.
 *
 * **Configuration:**
 * - Window: 15 minutes
 * - Max requests: 100 per IP
 * - Headers: RateLimit-* (standard)
 *
 * **Response on limit exceeded:**
 * ```json
 * {
 *   "error": "Too Many Requests",
 *   "code": "RATE_LIMIT_EXCEEDED",
 *   "details": "Too many requests from this IP, please try again later"
 * }
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { defaultRateLimiter } from './middleware/rate-limit.js';
 *
 * // Apply to all routes
 * app.use(defaultRateLimiter);
 *
 * // Apply to specific router
 * app.use('/api/public', defaultRateLimiter);
 * ```
 */
export const defaultRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    code: 'RATE_LIMIT_EXCEEDED',
    details: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication endpoints.
 * Allows 10 requests per 15 minutes per IP.
 * Used for login, signup, password reset, etc.
 *
 * **Configuration:**
 * - Window: 15 minutes
 * - Max requests: 10 per IP
 * - Headers: RateLimit-* (standard)
 *
 * **Response on limit exceeded:**
 * ```json
 * {
 *   "error": "Too Many Requests",
 *   "code": "AUTH_RATE_LIMIT_EXCEEDED",
 *   "details": "Too many authentication attempts, please try again later"
 * }
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { authRateLimiter } from './middleware/rate-limit.js';
 *
 * // Apply to auth routes
 * app.use('/api/auth', authRateLimiter);
 *
 * // Or combine with requireAuth
 * router.post('/login', authRateLimiter, loginHandler);
 * ```
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit auth attempts
  message: {
    error: 'Too Many Requests',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    details: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Very strict rate limiter for sensitive operations.
 * Allows 5 requests per hour per IP.
 * Used for password changes, account deletion, etc.
 *
 * **Configuration:**
 * - Window: 1 hour
 * - Max requests: 5 per IP
 * - Headers: RateLimit-* (standard)
 *
 * **Response on limit exceeded:**
 * ```json
 * {
 *   "error": "Too Many Requests",
 *   "code": "SENSITIVE_RATE_LIMIT_EXCEEDED",
 *   "details": "Too many sensitive operation attempts, please try again later"
 * }
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { sensitiveRateLimiter } from './middleware/rate-limit.js';
 *
 * // Protect password change endpoint
 * router.post('/change-password', sensitiveRateLimiter, requireAuth, changePasswordHandler);
 *
 * // Protect account deletion
 * router.delete('/account', sensitiveRateLimiter, requireAuth, deleteAccountHandler);
 * ```
 */
export const sensitiveRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    error: 'Too Many Requests',
    code: 'SENSITIVE_RATE_LIMIT_EXCEEDED',
    details: 'Too many sensitive operation attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
