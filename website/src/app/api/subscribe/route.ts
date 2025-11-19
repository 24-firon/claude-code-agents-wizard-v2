/**
 * Newsletter Subscription API Route
 * Handles newsletter signups with validation, rate limiting, and email confirmation
 */

import { NextRequest } from 'next/server';
import { newsletterSchema } from '@/lib/validation/schemas';
import { sendNewsletterWelcome } from '@/lib/email/service';
import {
  checkRateLimit,
  getRateLimitIdentifier,
  RATE_LIMITS,
} from '@/lib/utils/rate-limit';
import {
  createSuccessResponse,
  handleMethodNotAllowed,
  handleRateLimitError,
  safeErrorHandler,
  logSecurityEvent,
} from '@/lib/utils/errors';
import { sanitizeFormInput, validateInputSafety } from '@/lib/utils/sanitize';

/**
 * POST /api/subscribe
 * Subscribe to newsletter
 */
export async function POST(request: NextRequest) {
  try {
    // Get rate limit identifier (IP address)
    const identifier = getRateLimitIdentifier(request);

    // Check rate limit (3 requests per 15 minutes)
    const rateLimitResult = checkRateLimit(identifier, RATE_LIMITS.NEWSLETTER);

    if (!rateLimitResult.allowed) {
      logSecurityEvent('Rate limit exceeded', identifier, {
        endpoint: '/api/subscribe',
      });
      return handleRateLimitError(rateLimitResult.resetTime);
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validatedData = newsletterSchema.parse(body);

    // Sanitize email
    const sanitizedEmail = sanitizeFormInput(validatedData.email, 'email');

    // Security check: Validate email safety
    try {
      validateInputSafety(sanitizedEmail, 'email');
    } catch (error) {
      logSecurityEvent('Suspicious email detected', identifier, {
        endpoint: '/api/subscribe',
        error: error instanceof Error ? error.message : 'Unknown',
      });
      throw error;
    }

    // Send welcome email
    const welcomeResult = await sendNewsletterWelcome(sanitizedEmail);

    // Log successful subscription (without PII)
    console.log('Newsletter subscription successful:', {
      emailId: welcomeResult.id,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add ConvertKit/Email platform integration
    // const emailPlatformResponse = await fetch(
    //   `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       api_key: process.env.CONVERTKIT_API_KEY,
    //       email: sanitizedEmail,
    //       tags: validatedData.interests,
    //     }),
    //   }
    // );

    // TODO: Add n8n webhook for additional automation
    // await fetch(process.env.N8N_NEWSLETTER_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: sanitizedEmail,
    //     interests: validatedData.interests,
    //     subscribedAt: new Date().toISOString(),
    //   }),
    // });

    // Return success response
    return createSuccessResponse(
      {
        subscriptionId: welcomeResult.id,
        email: sanitizedEmail,
        message: 'Thank you for subscribing! Check your email for confirmation.',
      },
      'Newsletter subscription successful',
      201
    );
  } catch (error) {
    return safeErrorHandler(error);
  }
}

/**
 * GET /api/subscribe
 * Not allowed - return method not allowed
 */
export async function GET() {
  return handleMethodNotAllowed(['POST']);
}

/**
 * OPTIONS /api/subscribe
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
