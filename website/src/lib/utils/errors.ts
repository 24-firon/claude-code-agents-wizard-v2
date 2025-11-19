/**
 * Error Handling Utilities
 * Consistent error responses and logging
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Error codes for API responses
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * Create error response with consistent format
 */
export function createErrorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  // Log error for monitoring (exclude sensitive data)
  console.error(`API Error [${code}]:`, message, details ? '(details omitted)' : '');

  return NextResponse.json(response, { status });
}

/**
 * Create success response with consistent format
 */
export function createSuccessResponse<T = unknown>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    ...(data && { data }),
    ...(message && { message }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiErrorResponse> {
  const details = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return createErrorResponse(
    ERROR_CODES.VALIDATION_ERROR,
    'Invalid input data',
    400,
    details
  );
}

/**
 * Handle rate limit errors
 */
export function handleRateLimitError(resetTime: number): NextResponse<ApiErrorResponse> {
  const resetDate = new Date(resetTime);
  const response = createErrorResponse(
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    'Too many requests. Please try again later.',
    429,
    {
      resetAt: resetDate.toISOString(),
      resetTimestamp: resetTime,
    }
  );

  // Add Retry-After header
  const retryAfterSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  response.headers.set('Retry-After', retryAfterSeconds.toString());

  return response;
}

/**
 * Handle method not allowed errors
 */
export function handleMethodNotAllowed(allowedMethods: string[]): NextResponse<ApiErrorResponse> {
  const response = createErrorResponse(
    ERROR_CODES.METHOD_NOT_ALLOWED,
    `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    405
  );

  response.headers.set('Allow', allowedMethods.join(', '));

  return response;
}

/**
 * Handle internal server errors
 * Hides implementation details from client
 */
export function handleInternalError(error: unknown): NextResponse<ApiErrorResponse> {
  // Log full error for debugging
  console.error('Internal server error:', error);

  // Return generic error to client (don't expose internals)
  return createErrorResponse(
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred. Please try again later.',
    500
  );
}

/**
 * Safe error handler that catches all errors
 */
export function safeErrorHandler(error: unknown): NextResponse<ApiErrorResponse> {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // Handle known error types
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('rate limit')) {
      return createErrorResponse(
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        error.message,
        429
      );
    }

    if (error.message.includes('not found')) {
      return createErrorResponse(
        ERROR_CODES.NOT_FOUND,
        error.message,
        404
      );
    }

    if (error.message.includes('forbidden') || error.message.includes('Suspicious content')) {
      return createErrorResponse(
        ERROR_CODES.FORBIDDEN,
        error.message,
        403
      );
    }

    // Log and return generic error
    console.error('Error:', error.message);
    return createErrorResponse(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      'An error occurred while processing your request',
      500
    );
  }

  // Unknown error type
  return handleInternalError(error);
}

/**
 * Log security event for monitoring
 */
export function logSecurityEvent(
  event: string,
  identifier: string,
  details?: unknown
): void {
  console.warn(`[SECURITY] ${event}`, {
    identifier,
    timestamp: new Date().toISOString(),
    details,
  });
}
