import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/db.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Cho phép fallback sang Authorization header Bearer token
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn');
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user || !user.isActive) {
      return sendError(res, 401, 'Tài khoản không tồn tại hoặc đã bị khóa');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
  }
};
