import { Router } from 'express';
import { getMeHandler } from './users.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getMeHandler);

export default router;
