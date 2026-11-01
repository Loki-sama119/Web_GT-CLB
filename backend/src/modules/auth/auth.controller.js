import { AuthService } from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { setAuthCookie, clearAuthCookie } from '../../utils/jwt.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      setAuthCookie(res, token);
      const data = { user };
      if (process.env.NODE_ENV === 'test') {
        data.token = token;
      }
      return sendSuccess(res, 201, 'Đăng ký tài khoản sinh viên thành công', data);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.login(req.body);
      setAuthCookie(res, token);
      const data = { user };
      if (process.env.NODE_ENV === 'test') {
        data.token = token;
      }
      return sendSuccess(res, 200, 'Đăng nhập thành công', data);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      clearAuthCookie(res);
      return sendSuccess(res, 200, 'Đăng xuất thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, 200, 'Lấy thông tin tài khoản thành công', { user });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      return sendSuccess(res, 200, result.message, result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req.body);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const result = await AuthService.changePassword(req.user.id, req.body);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}
