import prisma from '../../config/db.js';

export class UsersService {
  static async getProfile(userId) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true, role: true, createdAt: true }
        }
      }
    });

    if (!profile) {
      const err = new Error('Hồ sơ sinh viên chưa được khởi tạo');
      err.statusCode = 404;
      throw err;
    }

    return profile;
  }

  static async updateProfile(userId, data) {
    const { fullName, phone, faculty, major, academicYear, bio, skills, interests } = data;

    const updated = await prisma.studentProfile.update({
      where: { userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(faculty !== undefined && { faculty }),
        ...(major !== undefined && { major }),
        ...(academicYear !== undefined && { academicYear }),
        ...(bio !== undefined && { bio }),
        ...(skills !== undefined && { skills }),
        ...(interests !== undefined && { interests })
      }
    });

    return updated;
  }
}
