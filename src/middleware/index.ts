import type { Application } from 'express';
import setupCookieParser from './setup-cookie-parser';
import setupCors from './setup-cors';
import setupPassport from './setup-passport';
import setupPostgres from './setup-postgres';
import setupRateLimit from './setup-rate-limit';
import setupSession from './setup-session';

// Export individual setup functions
export {
  setupCors,
  setupPassport,
  setupPostgres,
  setupRateLimit,
  setupSession,
};

// Export helper functions
export { getPgPool } from './setup-postgres';
export { apiLimiter, authLimiter } from './setup-rate-limit';
export { csrfProtection, generateCsrfToken } from './setup-csrf';

// Export composition function that sets up all middleware in correct order
export const setupMiddleware = async (app: Application): Promise<void> => {
  // Setup database connection first (needed by session and passport)
  await setupPostgres(app);

  // Setup session (needed by passport and CSRF)
  await setupSession(app);

  // Setup cookie-parser after session (as per csrf-csrf docs)
  setupCookieParser(app);

  // Setup passport (depends on session)
  await setupPassport(app);

  // Setup CORS and rate limiting (can be done in parallel, but order matters for middleware)
  setupCors(app);
  setupRateLimit(app);
};
