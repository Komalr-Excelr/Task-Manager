import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middleware/validate';
import { loginDto, registerDto, updateProfileDto } from '../dtos/auth.dto';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', validateBody(registerDto), AuthController.register);
router.post('/login', validateBody(loginDto), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);
router.patch('/users/me', authMiddleware, validateBody(updateProfileDto), AuthController.updateProfile);

export default router;