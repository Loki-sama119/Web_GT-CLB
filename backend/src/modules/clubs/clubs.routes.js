import { Router } from 'express';
import { ClubsController } from './clubs.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireSuperAdmin, requireClubAdmin } from '../../middlewares/rbac.js';

const router = Router();

// Public routes
router.get('/categories', ClubsController.getCategories);
router.get('/clubs', ClubsController.getClubs);
router.get('/clubs/:slug', ClubsController.getClubBySlug);

// Protected routes
router.post('/clubs', authenticate, requireSuperAdmin, ClubsController.createClub);
router.put('/clubs/:id', authenticate, requireClubAdmin(req => req.params.id), ClubsController.updateClub);

export default router;
