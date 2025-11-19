/**
 * Calendly Webhook Handler
 * Triggered when someone books a consultation
 * Creates CRM entry and sends notifications
 */

import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';
import {
  createSuccessResponse,
  handleMethodNotAllowed,
  createErrorResponse,
  ERROR_CODES,
  safeErrorHandler,
} from '@/lib/utils/errors';
import { sendPlainTextEmail } from '@/lib/email/service';

/**
 * Verify Calendly webhook signature
 */
function verifyCalendlySignature(
  body: string,
  signature: string,
  timestamp: string
): boolean {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('CALENDLY_WEBHOOK_SECRET not configured');
    return false;
  }

  // Calendly uses HMAC-SHA256 with timestamp
  const payload = `${timestamp}.${body}`;
  const hash = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `v1=${hash}` === signature;
}

/**
 * POST /api/webhooks/calendly
 * Handle Calendly booking events
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature headers
    const signature = request.headers.get('calendly-webhook-signature');
    const timestamp = request.headers.get('calendly-webhook-timestamp');

    if (!signature || !timestamp) {
      return createErrorResponse(
        ERROR_CODES.UNAUTHORIZED,
        'Missing webhook headers',
        401
      );
    }

    // Read raw body
    const rawBody = await request.text();

    // Verify signature
    if (!verifyCalendlySignature(rawBody, signature, timestamp)) {
      console.warn('Invalid Calendly webhook signature');
      return createErrorResponse(
        ERROR_CODES.FORBIDDEN,
        'Invalid webhook signature',
        403
      );
    }

    // Parse payload
    const payload = JSON.parse(rawBody);

    // Extract event information
    const event = payload.event;
    const eventType = payload.event_type; // invitee.created, invitee.canceled

    if (eventType === 'invitee.created') {
      // Extract invitee details
      const invitee = payload.payload.invitee;
      const scheduledEvent = payload.payload.scheduled_event;

      const bookingDetails = {
        name: invitee.name,
        email: invitee.email,
        eventName: scheduledEvent.name,
        startTime: scheduledEvent.start_time,
        endTime: scheduledEvent.end_time,
        location: scheduledEvent.location?.join_url || 'TBD',
        timezone: invitee.timezone,
      };

      console.log('Calendly booking received:', {
        email: bookingDetails.email,
        eventName: bookingDetails.eventName,
        startTime: bookingDetails.startTime,
      });

      // Send notification to admin
      await sendPlainTextEmail({
        to: process.env.ADMIN_EMAIL || 'team@kiagentur.com',
        subject: `📅 New Consultation Booked: ${bookingDetails.name}`,
        text: `
New consultation booking:

Name: ${bookingDetails.name}
Email: ${bookingDetails.email}
Event: ${bookingDetails.eventName}
Date/Time: ${new Date(bookingDetails.startTime).toLocaleString('en-US', { timeZone: 'Europe/Berlin' })}
Location: ${bookingDetails.location}

Please add this to the CRM and prepare for the call.
        `.trim(),
      });

      // TODO: Add to CRM via n8n or direct API
      // await fetch(process.env.N8N_CALENDLY_WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bookingDetails),
      // });

      return createSuccessResponse(
        {
          received: true,
          eventType,
          inviteeEmail: bookingDetails.email,
        },
        'Booking processed successfully'
      );
    }

    if (eventType === 'invitee.canceled') {
      const invitee = payload.payload.invitee;

      console.log('Calendly booking canceled:', {
        email: invitee.email,
        timestamp: new Date().toISOString(),
      });

      // TODO: Update CRM with cancellation
      // TODO: Send notification to admin

      return createSuccessResponse(
        {
          received: true,
          eventType,
        },
        'Cancellation processed successfully'
      );
    }

    // Other event types
    return createSuccessResponse(
      {
        received: true,
        eventType,
      },
      'Webhook received but not processed'
    );
  } catch (error) {
    return safeErrorHandler(error);
  }
}

/**
 * GET /api/webhooks/calendly
 * Not allowed
 */
export async function GET() {
  return handleMethodNotAllowed(['POST']);
}
