import { z } from 'zod';

export const subscribeSchema = z.object({
  planCode: z.string(),
});

export const cancelSchema = z.object({
  cancelAtCycleEnd: z.boolean().optional().default(false),
});
