import { Router } from 'express';
import { MembershipsController } from './memberships.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireClubAdmin } from '../../middlewares/rbac.js';

const router = Router();

// Xem danh sách thành viên CLB
router.get('/clubs/:clubId/members', MembershipsController.getClubMembers);

// Xuất danh sách thành viên CLB ra Excel/CSV (Chỉ Club Admin hoặc Super Admin)
router.get(
  '/clubs/:clubId/members/export',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  MembershipsController.exportClubMembers
);

// Cập nhật chức vụ thành viên
router.patch(
  '/clubs/:clubId/members/:memberId/role',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  MembershipsController.updateMemberRole
);

// Xóa thành viên
router.delete(
  '/clubs/:clubId/members/:memberId',
  authenticate,
  requireClubAdmin(req => req.params.clubId),
  MembershipsController.removeMember
);

export default router;
