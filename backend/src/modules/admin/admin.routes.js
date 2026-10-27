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

    // Mitigate CSV Formula Injection (OWASP ASVS)
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      let str = String(field);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
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

// Tải file mẫu CSV để nhập danh sách CLB BAFU
router.get('/clubs/template-csv', async (req, res, next) => {
  try {
    const headers = [
      'Tên Câu Lạc Bộ',
      'Mã Định Danh (Slug)',
      'Lĩnh Vực',
      'Email Liên Hệ',
      'Số Điện Thoại',
      'Lịch Sinh Hoạt',
      'Mô Tả Ngắn',
      'Mô Tả Chi Tiết',
      'Email Chủ Nhiệm',
      'Trạng Thái'
    ];

    const sampleRow = [
      'CLB Tiếng Anh BAFU English Club',
      'bafu-english-club',
      'Học thuật & Công nghệ',
      'english.club@bafu.edu.vn',
      '02043874112',
      'Thứ 5 hàng tuần lúc 18h30 tại Phòng Hội thảo B2',
      'Giao lưu và rèn luyện kỹ năng giao tiếp tiếng Anh cho sinh viên BAFU.',
      'Câu lạc bộ Tiếng Anh BAFU là nơi kết nối sinh viên yêu thích ngoại ngữ, tổ chức các buổi debate, workshop với giảng viên nước ngoài.',
      'admin@bafu.edu.vn',
      'ACTIVE'
    ];

    const escape = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvContent = '\uFEFF' + [
      headers.map(escape).join(','),
      sampleRow.map(escape).join(',')
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mau-nhap-clb-bafu.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
});

// Nhập danh sách CLB từ file CSV
router.post('/clubs/import-csv', async (req, res, next) => {
  try {
    const { csvContent } = req.body;
    if (!csvContent || typeof csvContent !== 'string') {
      return sendError(res, 400, 'Dữ liệu CSV không hợp lệ hoặc để trống');
    }

    const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
    if (lines.length < 2) {
      return sendError(res, 400, 'File CSV cần có ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu');
    }

    const parseLine = (line) => {
      const values = [];
      let insideQuotes = false;
      let cur = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (insideQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          values.push(cur.trim());
          cur = '';
        } else {
          cur += char;
        }
      }
      values.push(cur.trim());
      return values;
    };

    const slugify = (text) => {
      return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    const headerKeys = parseLine(lines[0]);
    const results = {
      totalProcessed: 0,
      created: [],
      skipped: []
    };

    const allCategories = await prisma.clubCategory.findMany();
    const defaultCategory = allCategories[0];

    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i].trim();
      if (!rawLine) continue;

      results.totalProcessed++;
      const vals = parseLine(rawLine);
      const row = {};
      headerKeys.forEach((k, idx) => {
        row[k] = vals[idx] || '';
      });

      const name = row['Tên Câu Lạc Bộ'] || row['name'] || row['Tên CLB'];
      if (!name) {
        results.skipped.push({ row: i, reason: 'Thiếu tên câu lạc bộ' });
        continue;
      }

      let slug = row['Mã Định Danh (Slug)'] || row['slug'] || slugify(name);
      if (!slug) slug = `clb-${Date.now()}`;

      // Kiểm tra trùng tên hoặc slug
      const existing = await prisma.club.findFirst({
        where: {
          OR: [{ name }, { slug }]
        }
      });

      if (existing) {
        results.skipped.push({ row: i, name, reason: `Tên hoặc mã slug "${slug}" đã tồn tại` });
        continue;
      }

      // Xác định danh mục
      const catName = row['Lĩnh Vực'] || row['category'];
      let matchedCategory = allCategories.find(c => 
        c.name.toLowerCase() === (catName || '').toLowerCase() || 
        c.slug === slugify(catName || '')
      );
      if (!matchedCategory) matchedCategory = defaultCategory;

      const rawStatus = (row['Trạng Thái'] || row['status'] || 'PENDING').toUpperCase();
      const status = ['ACTIVE', 'INACTIVE', 'PENDING'].includes(rawStatus) ? rawStatus : 'PENDING';

      const newClub = await prisma.club.create({
        data: {
          name,
          slug,
          categoryId: matchedCategory.id,
          shortDescription: row['Mô Tả Ngắn'] || `Câu lạc bộ ${name} sinh viên BAFU`,
          description: row['Mô Tả Chi Tiết'] || row['Mô Tả Ngắn'] || `Thông tin chi tiết về câu lạc bộ ${name}`,
          email: row['Email Liên Hệ'] || null,
          phone: row['Số Điện Thoại'] || null,
          meetingSchedule: row['Lịch Sinh Hoạt'] || null,
          status
        }
      });

      // Nếu có email chủ nhiệm, phân quyền LEADER
      const leaderEmail = row['Email Chủ Nhiệm'] || row['leaderEmail'];
      if (leaderEmail) {
        const leaderUser = await prisma.user.findUnique({ where: { email: leaderEmail.trim() } });
        if (leaderUser) {
          await prisma.clubMembership.upsert({
            where: {
              userId_clubId: { userId: leaderUser.id, clubId: newClub.id }
            },
            update: { role: 'LEADER', status: 'ACTIVE' },
            create: { userId: leaderUser.id, clubId: newClub.id, role: 'LEADER', status: 'ACTIVE' }
          });
        }
      }

      results.created.push({ id: newClub.id, name: newClub.name, slug: newClub.slug, status: newClub.status });
    }

    // Ghi AuditLog
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'IMPORT_CLUBS_CSV',
        entityType: 'Club',
        details: JSON.stringify({ 
          total: results.totalProcessed, 
          created: results.created.length, 
          skipped: results.skipped.length 
        })
      }
    });

    return sendSuccess(res, 200, 'Xử lý nhập danh sách CLB từ CSV hoàn tất', results);
  } catch (error) {
    next(error);
  }
});

// Phê duyệt hoặc cập nhật trạng thái hoạt động của CLB (PENDING -> ACTIVE / INACTIVE)
router.patch('/clubs/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'PENDING', 'INACTIVE'].includes(status)) {
      return sendError(res, 400, 'Trạng thái CLB không hợp lệ. Chỉ chấp nhận ACTIVE, PENDING, INACTIVE');
    }

    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) {
      return sendError(res, 404, 'Không tìm thấy câu lạc bộ');
    }

    const updated = await prisma.club.update({
      where: { id },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_CLUB_STATUS',
        entityType: 'Club',
        entityId: id,
        details: JSON.stringify({ oldStatus: club.status, newStatus: status })
      }
    });

    return sendSuccess(res, 200, `Cập nhật trạng thái CLB thành "${status}" thành công`, { club: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
