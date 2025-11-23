import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/response';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(
      res,
      'RATE_LIMITED',
      'Too many requests, please try again later',
      429
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later',
  handler: (_req, res) => {
    sendError(
      res,
      'RATE_LIMITED',
      'Too many login attempts, please try again in 15 minutes',
      429
    );
  },
});

export const webhookRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 webhooks per minute per IP
  message: 'Too many webhook requests',
  handler: (_req, res) => {
    sendError(
      res,
      'RATE_LIMITED',
      'Too many webhook requests',
      429
    );
  },
});
