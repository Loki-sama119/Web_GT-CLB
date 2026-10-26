import { UsersService } from './users.service.js';
import { sendSuccess } from '../../utils/response.js';

export class UsersController {
  static async getProfile(req, res, next) {
    try {
      const profile = await UsersService.getProfile(req.user.id);
      return sendSuccess(res, 200, 'Lấy thông tin hồ sơ thành công', { profile });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const profile = await UsersService.updateProfile(req.user.id, req.body);
      return sendSuccess(res, 200, 'Cập nhật hồ sơ sinh viên thành công', { profile });
    } catch (error) {
      next(error);
    }
  }
}
