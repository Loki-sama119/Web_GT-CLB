export const sendSuccess = (res, statusCode = 200, message = 'Thành công', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta })
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode = 500, message = 'Đã có lỗi xảy ra', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors })
  };
  return res.status(statusCode).json(response);
};
