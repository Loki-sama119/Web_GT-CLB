import { ClubsService } from './clubs.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ClubsController {
  static async getCategories(req, res, next) {
    try {
      const categories = await ClubsService.getCategories();
      return sendSuccess(res, 200, 'Lấy danh mục câu lạc bộ thành công', { categories });
    } catch (error) {
      next(error);
    }
  }

  static async getClubs(req, res, next) {
    try {
      const { category, search, recruiting, page, limit } = req.query;
      const { clubs, meta } = await ClubsService.getClubs({ category, search, recruiting, page, limit });
      return sendSuccess(res, 200, 'Lấy danh sách câu lạc bộ thành công', { clubs }, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getClubBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const club = await ClubsService.getClubBySlug(slug);
      return sendSuccess(res, 200, 'Lấy chi tiết câu lạc bộ thành công', { club });
    } catch (error) {
      next(error);
    }
  }

  static async createClub(req, res, next) {
    try {
      const club = await ClubsService.createClub(req.body);
      return sendSuccess(res, 201, 'Tạo câu lạc bộ mới thành công', { club });
    } catch (error) {
      next(error);
    }
  }

  static async updateClub(req, res, next) {
    try {
      const { id } = req.params;
      const club = await ClubsService.updateClub(id, req.body);
      return sendSuccess(res, 200, 'Cập nhật thông tin câu lạc bộ thành công', { club });
    } catch (error) {
      next(error);
    }
  }
}
