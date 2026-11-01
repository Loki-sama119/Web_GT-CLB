import { Router } from 'express';
import { ApplicationsController } from './applications.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';
import { applyLimiter } from '../../middlewares/rateLimiters.js';

const router = Router();

// Sinh viên nộp đơn
router.post('/recruitments/:campaignId/apply', authenticate, applyLimiter, ApplicationsController.submitApplication);

// Sinh viên xem đơn của mình
router.get('/applications/my-applications', authenticate, ApplicationsController.getMyApplications);

// Club Admin xem đơn của CLB
router.get('/clubs/:clubId/applications', authenticate, requireClubAdmin(req => req.params.clubId), ApplicationsController.getClubApplications);

// Club Admin xuất danh sách ứng viên Excel/CSV
router.get('/clubs/:clubId/applications/export', authenticate, requireClubAdmin(req => req.params.clubId), ApplicationsController.exportClubApplications);

// Xem chi tiết đơn
router.get('/applications/:id', authenticate, ApplicationsController.getApplicationById);

// Club Admin duyệt đơn
router.patch('/applications/:id/status', authenticate, ApplicationsController.reviewApplication);

// Sinh viên rút đơn
router.post('/applications/:id/withdraw', authenticate, ApplicationsController.withdrawApplication);

export default router;
