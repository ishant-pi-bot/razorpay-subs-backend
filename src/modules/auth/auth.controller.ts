import { Request, Response } from 'express';
import { z } from 'zod';
import { register, login } from './auth.service';
import { registerSchema, loginSchema } from './auth.schema';

export async function registerHandler(req: Request, res: Response) {
  try {
    const input = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await register(input);
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await login(input);
    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
