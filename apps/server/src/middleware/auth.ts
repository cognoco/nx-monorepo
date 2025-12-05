import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '../lib/supabase-admin.js';

/**
 * Extended Express Request interface with authenticated user context.
 * Middleware attaches the validated user to this property after successful authentication.
 */
export interface AuthenticatedRequest extends Request {
  /**
   * Authenticated user object from Supabase.
   *
   * @remarks
   * This property is optional on the interface to allow middleware composition,
   * but is **guaranteed to be defined** after the `requireAuth` middleware.
   * Route handlers protected by `requireAuth` can safely access `req.user`
   * without null checks.
   *
   * @example
   * ```typescript
   * router.get('/profile', requireAuth, (req: AuthenticatedRequest, res) => {
   *   // After requireAuth, user is guaranteed to exist
   *   const userId = req.user!.id; // Safe to use non-null assertion
   *   res.json({ id: userId });
   * });
   * ```
   */
  user?: User;
}

/**
 * Extracts Bearer token from Authorization header.
 * Supports case-insensitive "Bearer" prefix.
 *
 * @param authHeader - Authorization header value (e.g., "Bearer eyJhbGc...")
 * @returns Extracted JWT token string, or null if header is missing/malformed
 *
 * @example
 * ```typescript
 * // Valid header
 * extractBearerToken('Bearer eyJhbGc...')
 * // → 'eyJhbGc...'
 *
 * // Case-insensitive
 * extractBearerToken('bearer eyJhbGc...')
 * // → 'eyJhbGc...'
 *
 * // Missing header
 * extractBearerToken(undefined)
 * // → null
 *
 * // Malformed header
 * extractBearerToken('InvalidFormat')
 * // → null
 * ```
 */
export function extractBearerToken(
  authHeader: string | undefined
): string | null {
  if (!authHeader) {
    return null;
  }

  // Match "Bearer <token>" case-insensitively
  const match = authHeader.match(/^bearer\s+(\S+)$/i);
  if (!match) {
    return null;
  }

  return match[1];
}

/**
 * Validates JWT token with Supabase admin client.
 * Uses service role key to verify token authenticity and retrieve user data.
 *
 * **Format Validation:**
 * Performs fast format check before making Supabase API call to reject
 * malformed tokens early. JWT must have exactly 3 base64url-encoded parts
 * separated by dots (header.payload.signature).
 *
 * @param token - JWT token string to validate
 * @returns User object if token is valid, null otherwise
 *
 * @example
 * ```typescript
 * const user = await validateToken('eyJhbGc...');
 * if (user) {
 *   console.log('User authenticated:', user.id, user.email);
 * } else {
 *   console.log('Invalid or expired token');
 * }
 * ```
 */
export async function validateToken(token: string): Promise<User | null> {
  try {
    // JWT must have 3 base64url parts separated by dots (header.payload.signature)
    // Base64url alphabet: A-Z, a-z, 0-9, -, _
    const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (!jwtPattern.test(token)) {
      return null;
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch {
    // Catch any unexpected errors (network issues, etc.)
    return null;
  }
}

/**
 * Express middleware that requires valid JWT authentication.
 * Chains: extract token → validate → attach user → next()
 *
 * **Response format on failure:**
 * ```json
 * {
 *   "error": "Unauthorized",
 *   "code": "AUTH_REQUIRED" | "INVALID_TOKEN",
 *   "details": "Descriptive error message"
 * }
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { requireAuth } from './middleware/auth.js';
 *
 * // Protect a single route
 * app.get('/api/protected', requireAuth, (req, res) => {
 *   const user = (req as AuthenticatedRequest).user;
 *   res.json({ message: `Hello ${user.email}` });
 * });
 *
 * // Protect all routes in a router
 * const protectedRouter = express.Router();
 * protectedRouter.use(requireAuth);
 * protectedRouter.get('/profile', (req, res) => { ... });
 * ```
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  // Extract token from Authorization header
  const token = extractBearerToken(authHeader);
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      code: 'AUTH_REQUIRED',
      details:
        'Valid JWT token required in Authorization header (format: "Bearer <token>")',
    });
    return;
  }

  // Validate token with Supabase
  const user = await validateToken(token);
  if (!user) {
    res.status(401).json({
      error: 'Unauthorized',
      code: 'INVALID_TOKEN',
      details: 'JWT token is invalid or expired',
    });
    return;
  }

  // Attach user to request object and proceed
  req.user = user;
  next();
}
