/**
 * Production-grade error handling for authentication provider
 *
 * Features:
 * - Error hierarchy with specific error types
 * - Structured error codes with type safety
 * - Metadata support for additional context
 * - Security-conscious error messages
 * - Retry guidance
 */

// Error code constants for type safety
export const ErrorCode = {
  // Validation errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Authentication errors (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',

  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Conflict errors (409)
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Not found (404)
  NOT_FOUND: 'NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// Error metadata for additional context
export interface ErrorMetadata {
  // Validation errors
  field?: string;
  fields?: Record<string, string[]>; // Multiple field errors
  value?: unknown; // Invalid value (sanitized)

  // Rate limiting
  retryAfter?: number; // Seconds until retry allowed

  // Request context
  requestId?: string;
  userId?: string;

  // Additional context
  [key: string]: unknown;
}

// Base error class with enhanced features
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly metadata?: ErrorMetadata;
  readonly retryable: boolean;
  readonly isOperational: boolean; // True for expected errors (4xx), false for unexpected (5xx)

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode,
    options?: {
      metadata?: ErrorMetadata;
      retryable?: boolean;
      isOperational?: boolean;
    },
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.metadata = options?.metadata;
    this.retryable = options?.retryable ?? false;
    this.isOperational = options?.isOperational ?? statusCode < 500;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Serialize error for logging/monitoring
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      metadata: this.metadata,
      retryable: this.retryable,
      isOperational: this.isOperational,
      stack: this.stack,
    };
  }
}

// Specific error classes for better type safety and handling

export class ValidationError extends AppError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(400, message, ErrorCode.VALIDATION_ERROR, {
      metadata,
      isOperational: true,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required',
    code: ErrorCode = ErrorCode.UNAUTHORIZED,
    metadata?: ErrorMetadata,
  ) {
    super(401, message, code, {
      metadata,
      isOperational: true,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Insufficient permissions',
    metadata?: ErrorMetadata,
  ) {
    super(403, message, ErrorCode.FORBIDDEN, {
      metadata,
      isOperational: true,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    code: ErrorCode = ErrorCode.NOT_FOUND,
    metadata?: ErrorMetadata,
  ) {
    super(404, message, code, {
      metadata,
      isOperational: true,
    });
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.RESOURCE_CONFLICT,
    metadata?: ErrorMetadata,
  ) {
    super(409, message, code, {
      metadata,
      isOperational: true,
    });
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    metadata?: ErrorMetadata,
  ) {
    super(429, message, ErrorCode.RATE_LIMIT_EXCEEDED, {
      metadata: {
        ...metadata,
        retryAfter,
      },
      retryable: true,
      isOperational: true,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = 'An internal server error occurred',
    metadata?: ErrorMetadata,
  ) {
    super(500, message, ErrorCode.INTERNAL_SERVER_ERROR, {
      metadata,
      retryable: false,
      isOperational: false,
    });
  }
}

// Helper to check if error is retryable
export function isRetryableError(error: unknown): boolean {
  return error instanceof AppError && error.retryable;
}

// Helper to check if error is operational (expected)
export function isOperationalError(error: unknown): boolean {
  return error instanceof AppError && error.isOperational;
}
