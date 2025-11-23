import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Log error
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.userId,
    ip: req.ip,
  });

  // Handle known errors
  if (error instanceof AppError) {
    return sendError(
      res,
      error.code,
      error.message,
      error.statusCode,
      error.details
    );
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    if (prismaError.code === 'P2002') {
      return sendError(
        res,
        'CONFLICT',
        'Resource already exists',
        409,
        { field: prismaError.meta?.target }
      );
    }
    if (prismaError.code === 'P2025') {
      return sendError(res, 'NOT_FOUND', 'Resource not found', 404);
    }
  }

  // Handle validation errors from Prisma
  if (error.name === 'PrismaClientValidationError') {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Invalid data provided',
      400
    );
  }

  // Handle unknown errors
  const isDevelopment = env.NODE_ENV === 'development';

  return sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    isDevelopment ? error.message : 'An unexpected error occurred',
    500,
    isDevelopment ? { stack: error.stack } : undefined
  );
};

// Handle 404 routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return sendError(
    res,
    'NOT_FOUND',
    `Route ${req.method} ${req.path} not found`,
    404
  );
};
