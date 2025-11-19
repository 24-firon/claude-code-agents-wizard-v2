/**
 * Rate Limiting Utility
 * Simple in-memory rate limiting for API routes
 * For production, consider using Redis or Vercel Edge Config
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// NOTE: This will reset on serverless function cold starts
// For production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  // Contact form: 5 requests per 15 minutes per IP
  CONTACT_FORM: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Newsletter: 3 requests per 15 minutes per IP
  NEWSLETTER: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
  },
  // General API: 100 requests per 15 minutes per IP
  GENERAL: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
} as const;

/**
 * Check if request is within rate limit
 * Returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous entry or window expired - allow and create new entry
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.interval;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Within window - check count
  if (entry.count < config.maxRequests) {
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request
 * Uses IP address, falls back to generic identifier
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp;

  return ip || 'unknown';
}

/**
 * Clean up expired entries periodically
 * Call this in a cron job or on startup
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  console.log(`Cleaned up ${cleaned} expired rate limit entries`);
  return cleaned;
}

/**
 * Reset rate limit for specific identifier
 * Useful for testing or manual override
 */
export function resetRateLimit(identifier: string): boolean {
  return rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit status for identifier
 */
export function getRateLimitStatus(identifier: string): {
  count: number;
  resetTime: number;
} | null {
  const entry = rateLimitStore.get(identifier);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.resetTime) {
    rateLimitStore.delete(identifier);
    return null;
  }

  return {
    count: entry.count,
    resetTime: entry.resetTime,
  };
}
