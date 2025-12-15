import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createTaskDto, listTaskQueryDto, updateTaskDto } from '../dtos/task.dto';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', TaskController.dashboard);
router.get('/', validateQuery(listTaskQueryDto), TaskController.list);
router.post('/', validateBody(createTaskDto), TaskController.create);
router.get('/:id', TaskController.get);
router.patch('/:id', validateBody(updateTaskDto), TaskController.update);
router.delete('/:id', TaskController.remove);

export default router;