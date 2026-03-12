import { prisma } from '../../lib/prisma';
import { verifyWebhookSignature } from '../../lib/razorpay';
import { logger } from '../../lib/logger';

export async function processWebhook(provider: string, eventType: string, payload: any, signature: string | undefined, rawBody: string) {
  // Dedupe
  const existing = await prisma.webhookEvent.findUnique({
    where: { providerEventId: payload.id || '' },
  });
  if (existing && existing.processed) {
    logger.info('Webhook already processed', { providerEventId: payload.id });
    return { processed: false };
  }

  // Persist event
  const webhookEvent = await prisma.webhookEvent.upsert({
    where: { providerEventId: payload.id || '' },
    update: { processed: true, processedAt: new Date() },
    create: {
      provider,
      providerEventId: payload.id || '',
      eventType,
      signature,
      payload,
    },
  });

  // Process subscription update
  if (payload.entity?.object === 'subscription') {
    await updateSubscriptionFromPayload(payload.entity);
  }

  logger.info('Webhook processed', { webhookEventId: webhookEvent.id });
  return { processed: true };
}

async function updateSubscriptionFromPayload(subscription: any) {
  const localSub = await prisma.subscription.findUnique({
    where: { providerSubscriptionId: subscription.id },
  });

  if (!localSub) {
    logger.warn('Subscription not found locally', { subscriptionId: subscription.id });
    return;
  }

  await prisma.subscription.update({
    where: { id: localSub.id },
    data: {
      status: subscription.status,
      currentStartAt: subscription.current_start ? new Date(subscription.current_start) : null,
      currentEndAt: subscription.current_end ? new Date(subscription.current_end) : null,
      rawLastPayload: subscription,
      updatedAt: new Date(),
    },
  });

  // Recompute entitlement
  await recomputeEntitlement(localSub.userId);
}

async function recomputeEntitlement(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    include: { plan: true },
  });

  const entitlement = await prisma.entitlement.findUnique({ where: { userId } });
  if (!entitlement) return;

  let accessStatus = 'inactive';
  let validUntil = null;
  let graceUntil = null;
  let reason = 'No active subscription';

  if (subscription) {
    accessStatus = 'active';
    validUntil = subscription.currentEndAt;
    reason = 'Active subscription';
  }

  await prisma.entitlement.update({
    where: { id: entitlement.id },
    data: {
      accessStatus,
      validUntil,
      graceUntil,
      reason,
      planId: subscription?.planId || null,
    },
  });
}
