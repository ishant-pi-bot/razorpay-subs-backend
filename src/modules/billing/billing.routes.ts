import { Router } from 'express';
import { subscribeHandler, getSubscriptionHandler, cancelHandler } from './billing.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/subscribe', subscribeHandler);
router.get('/subscription', getSubscriptionHandler);
router.post('/cancel', cancelHandler);

export default router;
