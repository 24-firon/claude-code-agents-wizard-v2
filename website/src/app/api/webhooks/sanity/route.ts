/**
 * Sanity Webhook Handler
 * Triggered when content is published in Sanity CMS
 * Triggers rebuild for updated content
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

/**
 * Verify Sanity webhook signature
 */
function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET not configured');
    return false;
  }

  const hash = createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return hash === signature;
}

/**
 * POST /api/webhooks/sanity
 * Handle Sanity content updates
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from headers
    const signature = request.headers.get('x-sanity-signature');

    if (!signature) {
      return createErrorResponse(
        ERROR_CODES.UNAUTHORIZED,
        'Missing webhook signature',
        401
      );
    }

    // Read raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.warn('Invalid Sanity webhook signature');
      return createErrorResponse(
        ERROR_CODES.FORBIDDEN,
        'Invalid webhook signature',
        403
      );
    }

    // Parse body
    const payload = JSON.parse(rawBody);

    // Extract useful information
    const documentId = payload._id;
    const documentType = payload._type;
    const operation = payload._operation; // create, update, delete

    console.log('Sanity webhook received:', {
      documentId,
      documentType,
      operation,
      timestamp: new Date().toISOString(),
    });

    // TODO: Trigger Vercel rebuild for specific routes
    // if (documentType === 'post') {
    //   await fetch(
    //     `https://api.vercel.com/v1/integrations/deploy/${process.env.VERCEL_DEPLOY_HOOK}`,
    //     { method: 'POST' }
    //   );
    // }

    // TODO: Invalidate specific cache entries
    // revalidatePath('/blog');
    // revalidatePath(`/blog/${payload.slug?.current}`);

    return createSuccessResponse(
      {
        received: true,
        documentId,
        documentType,
        operation,
      },
      'Webhook processed successfully'
    );
  } catch (error) {
    return safeErrorHandler(error);
  }
}

/**
 * GET /api/webhooks/sanity
 * Not allowed
 */
export async function GET() {
  return handleMethodNotAllowed(['POST']);
}
