import { Router } from 'express';
import { MediaController } from './media.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';
import { uploadMedia } from '../../middlewares/upload.js';

const router = Router();

// Upload Avatar cá nhân (Sinh viên / Người dùng)
router.post('/users/me/avatar', authenticate, uploadMedia('avatar', 2), MediaController.uploadAvatar);

// Album ảnh hoạt động CLB (Xem công khai)
router.get('/clubs/:clubId/album', MediaController.getClubAlbum);

// Quản lý ảnh CLB (Yêu cầu Club Admin quản lý CLB đó hoặc Super Admin)
router.post(
  '/clubs/:clubId/logo',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  uploadMedia('logo', 2),
  MediaController.uploadLogo
);

router.post(
  '/clubs/:clubId/cover',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  uploadMedia('cover', 5),
  MediaController.uploadCover
);

router.post(
  '/clubs/:clubId/album',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  uploadMedia('album', 5),
  MediaController.addClubMedia
);

router.delete(
  '/clubs/:clubId/album/:mediaId',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  MediaController.deleteClubMedia
);

export default router;
