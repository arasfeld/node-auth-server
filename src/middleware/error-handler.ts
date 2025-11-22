import type { Request, Response, NextFunction } from 'express';
import {
  AppError,
  InternalServerError,
  isOperationalError,
  ErrorCode,
} from '../error';

// Standardized error response format
interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    code: string;
    // Include metadata for client context (e.g., validation field errors)
    metadata?: Record<string, unknown>;
    // Retry guidance
    retryable?: boolean;
    retryAfter?: number;
    // Development only
    stack?: string;
  };
}

// Generate request ID for correlation (simple implementation)
// In production, consider using uuid or request-id middleware
function getRequestId(req: Request): string {
  return (
    (req.headers['x-request-id'] as string) ||
    (req as Request & { id?: string }).id ||
    `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
}

// Structured error logging
function logError(err: Error, req: Request, isOperational: boolean): void {
  const requestId = getRequestId(req);
  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    statusCode: err instanceof AppError ? err.statusCode : 500,
    error:
      err instanceof AppError
        ? err.toJSON()
        : {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
    user: (req as Request & { user?: { id?: string } }).user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    isOperational,
    timestamp: new Date().toISOString(),
  };

  // Log operational errors at info level, unexpected errors at error level
  if (isOperational) {
    console.warn('Operational error:', JSON.stringify(logData, null, 2));
  } else {
    console.error('Unexpected error:', JSON.stringify(logData, null, 2));
  }

  // TODO: Integrate with error tracking service (Sentry, DataDog, etc.)
  // Example: Sentry.captureException(err, { extra: logData });
}

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // If response already sent, delegate to Express default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle AppError (known application errors)
  if (err instanceof AppError) {
    const isOperational = isOperationalError(err);

    // Log error with context
    logError(err, req, isOperational);

    // Build response
    const response: ErrorResponse = {
      error: {
        message: err.message,
        statusCode: err.statusCode,
        code: err.code,
        retryable: err.retryable,
      },
    };

    // Include metadata if present (useful for validation errors, etc.)
    if (err.metadata) {
      // Sanitize metadata - don't expose sensitive data
      const sanitizedMetadata: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(err.metadata)) {
        // Skip sensitive fields
        if (key === 'password' || key === 'passwordHash' || key === 'token') {
          continue;
        }
        sanitizedMetadata[key] = value;
      }
      if (Object.keys(sanitizedMetadata).length > 0) {
        response.error.metadata = sanitizedMetadata;
      }
    }

    // Include retry guidance
    if (err.retryable && err.metadata?.retryAfter) {
      response.error.retryAfter = err.metadata.retryAfter as number;
      // Set Retry-After header for rate limiting
      res.set('Retry-After', String(response.error.retryAfter));
    }

    // Include stack trace in development only
    if (process.env.NODE_ENV === 'development') {
      response.error.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors - convert to InternalServerError
  const internalError = new InternalServerError(
    process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message,
    {
      requestId: getRequestId(req),
      originalError: {
        name: err.name,
        message: err.message,
      },
    },
  );

  logError(internalError, req, false);

  const response: ErrorResponse = {
    error: {
      message: internalError.message,
      statusCode: internalError.statusCode,
      code: internalError.code,
      retryable: false,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(internalError.statusCode).json(response);
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ErrorResponse = {
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    },
  };

  res.status(404).json(response);
};
