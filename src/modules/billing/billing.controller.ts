import { Request, Response } from 'express';
import { z } from 'zod';
import { subscribe, getSubscription, cancel } from './billing.service';
import { subscribeSchema, cancelSchema } from './billing.schema';

export async function subscribeHandler(req: Request, res: Response) {
  try {
    const input = subscribeSchema.parse(req.body);
    const result = await subscribe(req.userId!, input);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function getSubscriptionHandler(req: Request, res: Response) {
  try {
    const subscription = await getSubscription(req.userId!);
    res.json(subscription);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export async function cancelHandler(req: Request, res: Response) {
  try {
    const input = cancelSchema.parse(req.body);
    const subscription = await cancel(req.userId!, input);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
