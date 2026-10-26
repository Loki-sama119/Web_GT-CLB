import { Router } from 'express';
import { ApplicationsController } from './applications.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';

const router = Router();

router.use(authenticate);

// Sinh viên nộp đơn
router.post('/recruitments/:campaignId/apply', ApplicationsController.submitApplication);

// Sinh viên xem đơn của mình
router.get('/applications/my-applications', ApplicationsController.getMyApplications);

// Club Admin xem đơn của CLB
router.get('/clubs/:clubId/applications', requireClubAdmin(req => req.params.clubId), ApplicationsController.getClubApplications);

// Xem chi tiết đơn
router.get('/applications/:id', ApplicationsController.getApplicationById);

// Club Admin duyệt đơn
router.patch('/applications/:id/status', ApplicationsController.reviewApplication);

// Sinh viên rút đơn
router.post('/applications/:id/withdraw', ApplicationsController.withdrawApplication);

export default router;
