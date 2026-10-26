import { sendError } from '../utils/response.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return sendError(res, 400, 'Dữ liệu gửi lên không hợp lệ', formattedErrors);
      }
      return sendError(res, 400, 'Lỗi kiểm tra dữ liệu đầu vào');
    }
  };
};
