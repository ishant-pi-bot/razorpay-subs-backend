import { prisma } from '../../lib/prisma';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken } from '../../lib/crypto';
import { registerSchema, loginSchema } from './auth.schema';
import { logger } from '../../lib/logger';

export async function register(input: z.infer<typeof registerSchema>) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
    },
  });

  await prisma.entitlement.create({
    data: {
      userId: user.id,
      accessStatus: 'inactive',
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function login(input: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}
