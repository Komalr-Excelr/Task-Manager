import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { UserController } from '../controllers/UserController';

const router = Router();

router.use(authMiddleware);
router.get('/', UserController.list);

export default router;