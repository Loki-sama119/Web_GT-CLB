import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate);
router.get('/profile', UsersController.getProfile);
router.put('/profile', UsersController.updateProfile);

export default router;
