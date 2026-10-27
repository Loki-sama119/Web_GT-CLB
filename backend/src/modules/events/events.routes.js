import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';

const router = Router();

// 1. Danh sách sự kiện công khai
router.get('/events', EventsController.getEvents);

// 2. Danh sách sự kiện của sinh viên hiện tại
router.get('/events/my-registrations', authenticate, EventsController.getMyRegistrations);

// 3. Chi tiết một sự kiện
router.get('/events/:id', EventsController.getEventById);

// 4. Sinh viên đăng ký tham gia sự kiện
router.post('/events/:id/register', authenticate, EventsController.registerEvent);

// 5. Sinh viên hủy đăng ký
router.post('/events/:id/cancel-registration', authenticate, EventsController.cancelRegistration);

// 6. BCN tạo sự kiện mới cho CLB
router.post('/clubs/:clubId/events', authenticate, requireClubAdmin(req => req.params.clubId), EventsController.createEvent);

// 7. BCN xem danh sách người đăng ký sự kiện
router.get('/events/:id/registrations', authenticate, EventsController.getEventRegistrations);

// 8. BCN cập nhật trạng thái sự kiện
router.patch('/events/:id/status', authenticate, EventsController.updateEventStatus);

export default router;
