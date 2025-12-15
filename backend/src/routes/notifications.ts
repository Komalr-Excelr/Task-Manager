import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();

router.use(authMiddleware);
router.get('/', NotificationController.list);
router.post('/:id/read', NotificationController.read);

export default router;