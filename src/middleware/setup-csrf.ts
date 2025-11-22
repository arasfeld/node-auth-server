import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

// Generate a cryptographically secure secret
// In production, this should be stored securely (env var, secret manager, etc.)
const getSecret = (): string => {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    throw new Error(
      'CSRF_SECRET environment variable is required. Generate one with: openssl rand -base64 32',
    );
  }
  return secret;
};

// Initialize CSRF protection with Double Submit Cookie Pattern
const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => getSecret(),
  getSessionIdentifier: (req: Request) => {
    // Use session ID as the unique identifier
    // This ensures tokens are tied to the session
    return req.session?.id || 'anonymous';
  },
  cookieName:
    process.env.NODE_ENV === 'production'
      ? '__Host-psifi.x-csrf-token'
      : 'csrf-token', // Remove security prefix for development
  cookieOptions: {
    sameSite: 'lax', // Match session cookie sameSite
    path: '/',
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
  },
  getCsrfTokenFromRequest: (req: Request) => {
    // Get token from header (preferred) or body
    // Do NOT get from cookie - that would defeat the purpose
    return (
      (req.headers['x-csrf-token'] as string) ||
      (req.headers['csrf-token'] as string) ||
      req.body?._csrf ||
      undefined
    );
  },
});

// Export the protection middleware
export { doubleCsrfProtection as csrfProtection };

// Export token generation function
export { generateCsrfToken };
