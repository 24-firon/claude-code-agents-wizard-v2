/**
 * Contact Form API Route
 * Handles contact form submissions with validation, rate limiting, and email notifications
 */

import { NextRequest } from 'next/server';
import { contactFormSchema } from '@/lib/validation/schemas';
import { sendContactConfirmation, sendAdminNotification } from '@/lib/email/service';
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
 * POST /api/contact
 * Submit contact form
 */
export async function POST(request: NextRequest) {
  try {
    // Get rate limit identifier (IP address)
    const identifier = getRateLimitIdentifier(request);

    // Check rate limit (5 requests per 15 minutes)
    const rateLimitResult = checkRateLimit(identifier, RATE_LIMITS.CONTACT_FORM);

    if (!rateLimitResult.allowed) {
      logSecurityEvent('Rate limit exceeded', identifier, {
        endpoint: '/api/contact',
      });
      return handleRateLimitError(rateLimitResult.resetTime);
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validatedData = contactFormSchema.parse(body);

    // Additional security: Sanitize inputs
    const sanitizedData = {
      name: sanitizeFormInput(validatedData.name, 'text'),
      email: sanitizeFormInput(validatedData.email, 'email'),
      company: sanitizeFormInput(validatedData.company, 'text'),
      message: sanitizeFormInput(validatedData.message, 'text'),
      budget: validatedData.budget,
    };

    // Security check: Detect potential attacks
    try {
      validateInputSafety(sanitizedData.name, 'name');
      validateInputSafety(sanitizedData.company, 'company');
      validateInputSafety(sanitizedData.message, 'message');
    } catch (error) {
      logSecurityEvent('Suspicious input detected', identifier, {
        endpoint: '/api/contact',
        error: error instanceof Error ? error.message : 'Unknown',
      });
      throw error;
    }

    // Send confirmation email to user
    const confirmationResult = await sendContactConfirmation(sanitizedData);

    // Send notification email to admin team
    const notificationResult = await sendAdminNotification(sanitizedData);

    // Log successful submission (without sensitive data)
    console.log('Contact form submitted successfully:', {
      company: sanitizedData.company,
      budget: sanitizedData.budget,
      emailsSent: {
        confirmation: confirmationResult.id,
        notification: notificationResult.id,
      },
    });

    // Send to n8n Lead Qualification Automation workflow
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedData),
          // Don't block response on n8n - fire and forget
          // This prevents slow n8n from affecting user experience
        });

        if (!n8nResponse.ok) {
          console.warn('n8n webhook returned non-200 status:', n8nResponse.status);
        }
      } catch (error) {
        // Log but don't throw - n8n webhook is async and non-critical
        console.error('Failed to send to n8n workflow:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Return success response
    return createSuccessResponse(
      {
        contactId: confirmationResult.id,
        message: 'Thank you for contacting us. We will respond within 24 hours.',
      },
      'Contact form submitted successfully',
      201
    );
  } catch (error) {
    return safeErrorHandler(error);
  }
}

/**
 * GET /api/contact
 * Not allowed - return method not allowed
 */
export async function GET() {
  return handleMethodNotAllowed(['POST']);
}

/**
 * OPTIONS /api/contact
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
