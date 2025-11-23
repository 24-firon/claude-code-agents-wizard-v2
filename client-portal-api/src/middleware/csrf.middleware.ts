import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

/**
 * Modern CSRF Protection Middleware
 *
 * This middleware implements CSRF protection through custom header verification.
 * Combined with SameSite=Strict cookies, this provides strong CSRF defense.
 *
 * Security layers:
 * 1. SameSite=Strict cookies (prevents cross-site cookie sending)
 * 2. Custom header requirement (cross-origin requests can't set custom headers)
 *
 * How it works:
 * - Legitimate requests from our frontend include X-Requested-With header
 * - Cross-site requests (CSRF attacks) cannot set this header
 * - Browser blocks cross-origin requests from setting custom headers
 */
export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Check for custom header that CSRF attacks cannot set
  const requestedWith = req.get('X-Requested-With');

  if (requestedWith !== 'XMLHttpRequest') {
    throw new UnauthorizedError(
      'CSRF validation failed - missing required header'
    );
  }

  next();
};

/**
 * Alternative: Origin validation for additional security
 * Verifies that requests come from allowed origins
 */
export const validateOrigin = (allowedOrigins: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const origin = req.get('Origin');
    const referer = req.get('Referer');

    // For same-origin requests, origin might be undefined
    if (!origin && !referer) {
      // Allow same-origin requests (no Origin/Referer headers)
      next();
      return;
    }

    // Check if origin is in allowed list
    const requestOrigin = origin || new URL(referer!).origin;

    if (!allowedOrigins.includes(requestOrigin)) {
      throw new UnauthorizedError(
        `Request from unauthorized origin: ${requestOrigin}`
      );
    }

    next();
  };
};
