import prisma from '../../config/db.js';

export class MembershipsService {
  // 1. Lấy danh sách thành viên có tìm kiếm và bộ lọc
  static async getClubMembers(clubId, { search, role, status = 'ACTIVE' } = {}) {
    const where = {
      clubId,
      ...(status && { status }),
      ...(role && { role }),
      ...(search && {
        user: {
          studentProfile: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { studentCode: { contains: search, mode: 'insensitive' } },
              { faculty: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      })
    };

    return prisma.clubMembership.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            studentProfile: true
          }
        }
      },
      orderBy: [
        { role: 'asc' }, // LEADER -> VICE_LEADER -> MEMBER
        { joinedAt: 'asc' }
      ]
    });
  }

  // 2. Cập nhật chức vụ hội viên
  static async updateMemberRole(clubId, memberId, role) {
    return prisma.clubMembership.update({
      where: { id: memberId },
      data: { role }
    });
  }

  // 3. Vô hiệu hóa hoặc xóa hội viên
  static async removeMember(clubId, memberId) {
    return prisma.clubMembership.update({
      where: { id: memberId },
      data: { status: 'INACTIVE' }
    });
  }

  // 4. Xuất danh sách hội viên Excel/CSV với UTF-8 BOM
  static async exportClubMembers(clubId) {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { name: true, slug: true }
    });

    if (!club) {
      const err = new Error('Câu lạc bộ không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    const members = await prisma.clubMembership.findMany({
      where: { clubId, status: 'ACTIVE' },
      include: {
        user: { include: { studentProfile: true } }
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' }
      ]
    });

    const headers = [
      'STT',
      'Họ Và Tên',
      'Mã Sinh Viên',
      'Email',
      'Số Điện Thoại',
      'Khoa/Khóa',
      'Chức Vụ Trong CLB',
      'Trạng Thái',
      'Ngày Gia Nhập'
    ];

    const roleMap = {
      LEADER: 'Chủ nhiệm câu lạc bộ',
      VICE_LEADER: 'Phó chủ nhiệm',
      MEMBER: 'Hội viên chính thức'
    };

    // Mitigate CSV Formula Injection (OWASP ASVS)
    const escape = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = members.map((m, index) => {
      const profile = m.user?.studentProfile;
      return [
        index + 1,
        escape(profile?.fullName || 'N/A'),
        escape(profile?.studentCode || 'N/A'),
        escape(m.user?.email || 'N/A'),
        escape(profile?.phone || 'Chưa cập nhật'),
        escape(profile?.faculty || 'N/A'),
        escape(roleMap[m.role] || m.role),
        escape(m.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'),
        escape(new Date(m.joinedAt).toLocaleDateString('vi-VN'))
      ].join(',');
    });

    const bom = '\uFEFF';
    const csvContent = bom + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
    const filename = `danh-sach-hoi-vien-${club.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

    return { filename, csvContent };
  }
}
