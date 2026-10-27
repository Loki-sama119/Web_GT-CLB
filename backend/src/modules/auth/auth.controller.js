import { AuthService } from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { setAuthCookie, clearAuthCookie } from '../../utils/jwt.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      setAuthCookie(res, token);
      return sendSuccess(res, 201, 'Đăng ký tài khoản sinh viên thành công', { user, token });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.login(req.body);
      setAuthCookie(res, token);
      return sendSuccess(res, 200, 'Đăng nhập thành công', { user, token });
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
}
