import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import plansRoutes from './modules/plans/plans.routes';
import billingRoutes from './modules/billing/billing.routes';
import entitlementsRoutes from './modules/entitlements/entitlements.routes';
import webhooksRoutes from './modules/webhooks/webhook.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_BASE_URL }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/auth', limiter);

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/plans', plansRoutes);
app.use('/billing', billingRoutes);
app.use('/entitlements', entitlementsRoutes);
app.use('/webhooks', webhooksRoutes);

app.use(errorHandler);

export default app;
