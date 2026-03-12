import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function getEntitlementHandler(req: Request, res: Response) {
  const entitlement = await prisma.entitlement.findUnique({
    where: { userId: req.userId! },
    include: { plan: true },
  });

  if (!entitlement) {
    return res.status(404).json({ error: 'Entitlement not found' });
  }

  res.json({
    accessStatus: entitlement.accessStatus,
    planCode: entitlement.plan?.code,
    validUntil: entitlement.validUntil,
    graceUntil: entitlement.graceUntil,
    maxDevices: entitlement.maxDevices,
    reason: entitlement.reason,
  });
}
