import { Router } from 'express';
import { RecruitmentsController } from './recruitments.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';

const router = Router();

// Lấy danh sách đợt tuyển theo CLB
router.get('/clubs/:clubId/recruitments', RecruitmentsController.getClubRecruitments);

// Tạo đợt tuyển mới cho CLB (Club Admin)
router.post('/clubs/:clubId/recruitments', authenticate, requireClubAdmin(req => req.params.clubId), RecruitmentsController.createRecruitment);

// Chi tiết đợt tuyển theo ID (Public)
router.get('/recruitments/:id', RecruitmentsController.getRecruitmentById);

// Cập nhật trạng thái đợt tuyển
router.patch('/recruitments/:id/status', authenticate, RecruitmentsController.updateRecruitmentStatus);

export default router;
