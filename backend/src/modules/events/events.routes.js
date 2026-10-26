import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/events', EventsController.getEvents);
router.post('/events/:id/register', authenticate, EventsController.registerEvent);

export default router;
