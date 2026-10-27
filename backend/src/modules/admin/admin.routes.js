import { Router } from 'express';
import prisma from '../../config/db.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireSuperAdmin } from '../../middlewares/rbac.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();

router.use(authenticate, requireSuperAdmin);

// Thống kê tổng quan cho Super Admin
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalUsers, totalClubs, totalApplications, totalMemberships, recentApplications, auditLogs] = await Promise.all([
      prisma.user.count(),
      prisma.club.count(),
      prisma.application.count(),
      prisma.clubMembership.count({ where: { status: 'ACTIVE' } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: {
          user: { include: { studentProfile: true } },
          campaign: { include: { club: true } }
        }
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } }
      })
    ]);

    return sendSuccess(res, 200, 'Lấy dữ liệu Super Admin Dashboard thành công', {
      totalUsers,
      totalClubs,
      totalApplications,
      totalMemberships,
      recentApplications,
      auditLogs
    });
  } catch (error) {
    next(error);
  }
});

// Danh sách người dùng
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        memberships: {
          include: {
            club: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    return sendSuccess(res, 200, 'Lấy danh sách người dùng thành công', { users: safeUsers });
  } catch (error) {
    next(error);
  }
});

// Phân quyền Club Admin cho một user đối với CLB cụ thể
router.post('/assign-club-admin', async (req, res, next) => {
  try {
    const { userId, clubId, role = 'LEADER' } = req.body;

    const membership = await prisma.clubMembership.upsert({
      where: {
        userId_clubId: {
          userId,
          clubId
        }
      },
      update: {
        role,
        status: 'ACTIVE'
      },
      create: {
        userId,
        clubId,
        role,
        status: 'ACTIVE'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'ASSIGN_CLUB_ADMIN',
        entityType: 'ClubMembership',
        entityId: membership.id,
        details: JSON.stringify({ assignedUserId: userId, clubId, role })
      }
    });

    return sendSuccess(res, 200, 'Phân quyền quản trị CLB thành công', { membership });
  } catch (error) {
    next(error);
  }
});

// Xem Audit Logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, studentProfile: { select: { fullName: true } } }
        }
      }
    });
    return sendSuccess(res, 200, 'Lấy danh sách nhật ký kiểm toán thành công', { logs });
  } catch (error) {
    next(error);
  }
});

export default router;
