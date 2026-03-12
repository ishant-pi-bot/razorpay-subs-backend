import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function getMeHandler(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, email: user.email, name: user.name });
}
