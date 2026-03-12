import axios from 'axios';
import { env } from '../config/env';

const API_BASE = 'https://api.razorpay.com/v1';

export async function createSubscription(
  customerId: string,
  planId: string,
  totalCount: number = 12
): Promise<{ subscriptionId: string }> {
  const response = await axios.post(
    `${API_BASE}/subscriptions`,
    {
      customer_id: customerId,
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
    },
    {
      auth: {
        username: env.RAZORPAY_KEY_ID,
        password: env.RAZORPAY_KEY_SECRET,
      },
    }
  );
  return { subscriptionId: response.data.id };
}

export async function fetchSubscription(subscriptionId: string): Promise<any> {
  const response = await axios.get(`${API_BASE}/subscriptions/${subscriptionId}`, {
    auth: {
      username: env.RAZORPAY_KEY_ID,
      password: env.RAZORPAY_KEY_SECRET,
    },
  });
  return response.data;
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtCycleEnd: boolean
): Promise<any> {
  const response = await axios.post(
    `${API_BASE}/subscriptions/${subscriptionId}/cancel`,
    { cancel_at_cycle_end: cancelAtCycleEnd },
    {
      auth: {
        username: env.RAZORPAY_KEY_ID,
        password: env.RAZORPAY_KEY_SECRET,
      },
    }
  );
  return response.data;
}

export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return signature === expectedSignature;
}
