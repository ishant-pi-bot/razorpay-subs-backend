import { prisma } from '../../lib/prisma';
import { createSubscription, fetchSubscription, cancelSubscription } from '../../lib/razorpay';
import { subscribeSchema, cancelSchema } from './billing.schema';
import { logger } from '../../lib/logger';

export async function subscribe(userId: string, input: z.infer<typeof subscribeSchema>) {
  const plan = await prisma.plan.findUnique({
    where: { code: input.planCode, isActive: true },
  });
  if (!plan) {
    throw new Error('Plan not found');
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        { status: 'active' },
        { status: 'pending' },
        { endedAt: null },
      ],
    },
  });
  if (subscription) {
    throw new Error('User already has an active subscription');
  }

  // Create Razorpay subscription
  const razorpayData = await createSubscription(userId, plan.razorpayPlanId!);
  const providerSubscriptionId = razorpayData.subscriptionId;

  // Persist local subscription
  const localSubscription = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      providerSubscriptionId,
      status: 'created',
    },
  });

  return { subscriptionId: localSubscription.id, razorpaySubscriptionId, razorpayKeyId: process.env.RAZORPAY_KEY_ID!, planCode: plan.code };
}

export async function getSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    include: { plan: true },
  });
  return subscription;
}

export async function cancel(userId: string, input: z.infer<typeof cancelSchema>) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
  });
  if (!subscription) {
    throw new Error('No active subscription found');
  }

  const razorpayData = await cancelSubscription(subscription.providerSubscriptionId!, input.cancelAtCycleEnd);
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'cancelled',
      cancelAtCycleEnd: input.cancelAtCycleEnd,
      rawLastPayload: razorpayData,
    },
  });

  return subscription;
}
