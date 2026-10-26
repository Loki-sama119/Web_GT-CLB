import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err);

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'dữ liệu';
    return sendError(res, 409, `Dữ liệu bị trùng lặp trường: ${target}`);
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return sendError(res, 404, 'Không tìm thấy dữ liệu yêu cầu');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống nội bộ máy chủ';
  return sendError(res, statusCode, message);
};
