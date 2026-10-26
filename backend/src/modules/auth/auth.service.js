import bcrypt from 'bcryptjs';
import prisma from '../../config/db.js';
import { generateToken } from '../../utils/jwt.js';

export class AuthService {
  static async register({ email, password, fullName, studentCode, faculty, phone }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err = new Error('Email này đã được sử dụng trên hệ thống');
      err.statusCode = 400;
      throw err;
    }

    const existingCode = await prisma.studentProfile.findUnique({ where: { studentCode } });
    if (existingCode) {
      const err = new Error('Mã sinh viên này đã được đăng ký');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            fullName,
            studentCode,
            faculty: faculty || '',
            phone: phone || ''
          }
        }
      },
      include: {
        studentProfile: true
      }
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        memberships: {
          include: {
            club: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    });

    if (!user) {
      const err = new Error('Email hoặc mật khẩu không chính xác');
      err.statusCode = 401;
      throw err;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const err = new Error('Email hoặc mật khẩu không chính xác');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên');
      err.statusCode = 403;
      throw err;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        memberships: {
          include: {
            club: {
              select: { id: true, name: true, slug: true, logoUrl: true }
            }
          }
        }
      }
    });

    if (!user) {
      const err = new Error('Không tìm thấy người dùng');
      err.statusCode = 404;
      throw err;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
