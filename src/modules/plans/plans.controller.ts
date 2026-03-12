import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function getPlansHandler(req: Request, res: Response) {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
  });
  res.json(plans);
}
