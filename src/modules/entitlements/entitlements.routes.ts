import { Router } from 'express';
import { getEntitlementHandler } from './entitlements.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getEntitlementHandler);

export default router;
