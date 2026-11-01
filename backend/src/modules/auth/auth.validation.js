import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  studentCode: z.string().min(3, 'Mã sinh viên phải có ít nhất 3 ký tự'),
  faculty: z.string().optional(),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không đúng định dạng')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  otp: z.string().length(6, 'Mã xác thực OTP phải gồm 6 chữ số'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
});
