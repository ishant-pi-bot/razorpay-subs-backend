import { Request, Response } from 'express';
import { processWebhook } from './webhook.service';
import { logger } from '../../lib/logger';

export async function webhookHandler(req: Request, res: Response) {
  const signature = req.headers['x-razorpay-signature'] as string | undefined;
  const eventId = req.headers['x-razorpay-event-id'] as string | undefined;
  const eventType = req.headers['x-razorpay-event-type'] as string || 'unknown';
  const rawBody = req.body as string;

  try {
    const success = await processWebhook('razorpay', eventType, JSON.parse(rawBody), signature, rawBody);
    res.status(200).json({ success });
  } catch (error) {
    logger.error('Webhook processing failed', { error: (error as Error).message });
    res.status(400).json({ error: 'Processing failed' });
  }
}
