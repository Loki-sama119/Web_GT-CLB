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
    const [
      totalUsers,
      totalClubs,
      totalApplications,
      totalMemberships,
      totalEvents,
      totalRegistrations,
      acceptedApps,
      rejectedApps,
      recentApplications,
      auditLogs,
      categories
    ] = await Promise.all([
      prisma.user.count(),
      prisma.club.count(),
      prisma.application.count(),
      prisma.clubMembership.count({ where: { status: 'ACTIVE' } }),
      prisma.clubEvent.count(),
      prisma.eventRegistration.count(),
      prisma.application.count({ where: { status: 'ACCEPTED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
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
      }),
      prisma.clubCategory.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { clubs: true } }
        }
      })
    ]);

    const reviewedAppsCount = acceptedApps + rejectedApps;
    const overallAcceptanceRate = reviewedAppsCount > 0 
      ? Math.round((acceptedApps / reviewedAppsCount) * 100) 
      : 0;

    return sendSuccess(res, 200, 'Lấy dữ liệu Super Admin Dashboard thành công', {
      totalUsers,
      totalClubs,
      totalApplications,
      totalMemberships,
      totalEvents,
      totalRegistrations,
      acceptedApps,
      rejectedApps,
      overallAcceptanceRate,
      recentApplications,
      auditLogs,
      categoriesDistribution: categories
    });
  } catch (error) {
    next(error);
  }
});

// Báo cáo thống kê hoạt động tất cả CLB toàn trường
router.get('/reports/clubs', async (req, res, next) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        category: true,
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            user: { select: { email: true, studentProfile: true } }
          }
        },
        campaigns: {
          include: {
            applications: {
              select: { id: true, status: true }
            }
          }
        },
        events: {
          include: {
            _count: { select: { registrations: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const reportData = clubs.map(club => {
      const leader = club.memberships.find(m => m.role === 'LEADER');
      const leaderName = leader?.user?.studentProfile?.fullName || leader?.user?.email || 'Chưa bổ nhiệm';

      const allApps = club.campaigns.flatMap(c => c.applications);
      const totalApps = allApps.length;
      const acceptedApps = allApps.filter(a => a.status === 'ACCEPTED').length;
      const rejectedApps = allApps.filter(a => a.status === 'REJECTED').length;
      const reviewed = acceptedApps + rejectedApps;
      const acceptanceRate = reviewed > 0 ? Math.round((acceptedApps / reviewed) * 100) : 0;

      const totalEvents = club.events.length;
      const totalRegistrations = club.events.reduce((sum, e) => sum + (e._count?.registrations || 0), 0);

      return {
        id: club.id,
        name: club.name,
        slug: club.slug,
        category: club.category?.name || 'Khác',
        leaderName,
        totalMembers: club.memberships.length,
        totalCampaigns: club.campaigns.length,
        totalApplications: totalApps,
        acceptedApplications: acceptedApps,
        acceptanceRate: `${acceptanceRate}%`,
        totalEvents,
        totalRegistrations,
        status: club.status
      };
    });

    return sendSuccess(res, 200, 'Lấy báo cáo hoạt động CLB toàn trường thành công', {
      reports: reportData
    });
  } catch (error) {
    next(error);
  }
});

// Xuất file CSV báo cáo CLB toàn trường cho Microsoft Excel (UTF-8 BOM)
router.get('/reports/clubs/export', async (req, res, next) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        category: true,
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            user: { select: { email: true, studentProfile: true } }
          }
        },
        campaigns: {
          include: {
            applications: {
              select: { id: true, status: true }
            }
          }
        },
        events: {
          include: {
            _count: { select: { registrations: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'STT',
      'Tên Câu Lạc Bộ',
      'Lĩnh Vực / Danh Mục',
      'Chủ Nhiệm / Đại Diện',
      'Số Thành Viên Chính Thức',
      'Số Đợt Tuyển Đã Mở',
      'Tổng Đơn Ứng Tuyển',
      'Số Đơn Trúng Tuyển',
      'Tỷ Lệ Trúng Tuyển (%)',
      'Số Sự Kiện Tổ Chức',
      'Lượt SV Đăng Ký Sự Kiện',
      'Trạng Thái Hoạt Động'
    ];

    const rows = clubs.map((club, index) => {
      const leader = club.memberships.find(m => m.role === 'LEADER');
      const leaderName = leader?.user?.studentProfile?.fullName || leader?.user?.email || 'Chưa bổ nhiệm';

      const allApps = club.campaigns.flatMap(c => c.applications);
      const totalApps = allApps.length;
      const acceptedApps = allApps.filter(a => a.status === 'ACCEPTED').length;
      const rejectedApps = allApps.filter(a => a.status === 'REJECTED').length;
      const reviewed = acceptedApps + rejectedApps;
      const acceptanceRate = reviewed > 0 ? Math.round((acceptedApps / reviewed) * 100) : 0;

      const totalEvents = club.events.length;
      const totalRegistrations = club.events.reduce((sum, e) => sum + (e._count?.registrations || 0), 0);

      return [
        index + 1,
        escapeCSV(club.name),
        escapeCSV(club.category?.name || 'Khác'),
        escapeCSV(leaderName),
        club.memberships.length,
        club.campaigns.length,
        totalApps,
        acceptedApps,
        `${acceptanceRate}%`,
        totalEvents,
        totalRegistrations,
        club.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'
      ].join(',');
    });

    // UTF-8 BOM (\uFEFF) đảm bảo mở tiếng Việt không bị lỗi font trên Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="bao-cao-clb-bafu-${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvContent);
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
