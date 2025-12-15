import { Router } from 'express';
import auth from './auth';
import tasks from './tasks';
import notifications from './notifications';
import users from './users';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', auth);
router.use('/tasks', tasks);
router.use('/notifications', notifications);
router.use('/users', users);

export default router;