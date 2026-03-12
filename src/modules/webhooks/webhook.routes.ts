import { Router } from 'express';
import { webhookHandler } from './webhook.controller';
import { rawBodyMiddleware } from '../../middleware/rawBody';

const router = Router();
router.use(rawBodyMiddleware);
router.post('/razorpay', webhookHandler);

export default router;
