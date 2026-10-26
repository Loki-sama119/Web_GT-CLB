import { sendError } from '../utils/response.js';
import prisma from '../config/db.js';

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return sendError(res, 403, 'Quyền truy cập bị từ chối: Yêu cầu quyền Quản trị viên hệ thống (Super Admin)');
  }
  next();
};

export const requireClubAdmin = (getClubIdFn) => {
  return async (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Vui lòng đăng nhập để thực hiện');
    }

    // Super Admin có toàn quyền trên mọi CLB
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const clubId = typeof getClubIdFn === 'function' ? getClubIdFn(req) : (req.params.clubId || req.params.id);

    if (!clubId) {
      return sendError(res, 400, 'Không xác định được mã câu lạc bộ để kiểm tra quyền');
    }

    // Kiểm tra membership của user trong CLB với vai trò LEADER hoặc VICE_LEADER
    const membership = await prisma.clubMembership.findFirst({
      where: {
        userId: req.user.id,
        clubId: clubId,
        status: 'ACTIVE',
        role: { in: ['LEADER', 'VICE_LEADER'] }
      }
    });

    if (!membership) {
      return sendError(res, 403, 'Quyền truy cập bị từ chối: Bạn không có quyền quản trị câu lạc bộ này');
    }

    req.clubMembership = membership;
    next();
  };
};
