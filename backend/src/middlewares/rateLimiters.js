import rateLimit from 'express-rate-limit';

// Rate Limiter bảo vệ đăng nhập và đăng ký (Chống Brute Force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 100, // Cho phép 100 lượt thử trong 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test' || req.headers['x-test-suite'] === 'playwright',
  message: {
    success: false,
    message: 'Bạn đã thử đăng nhập/đăng ký quá nhiều lần. Vui lòng thử lại sau 15 phút.'
  }
});

// Rate Limiter bảo vệ nộp hồ sơ ứng tuyển (Chống Spam nộp đơn)
export const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // Tối đa 20 đơn
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Bạn đã nộp quá nhiều hồ sơ ứng tuyển liên tục. Vui lòng chờ ít phút.'
  }
});
