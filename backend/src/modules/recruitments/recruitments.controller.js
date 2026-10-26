import { RecruitmentsService } from './recruitments.service.js';
import { sendSuccess } from '../../utils/response.js';

export class RecruitmentsController {
  static async getClubRecruitments(req, res, next) {
    try {
      const { clubId } = req.params;
      const recruitments = await RecruitmentsService.getClubRecruitments(clubId);
      return sendSuccess(res, 200, 'Lấy danh sách đợt tuyển thành công', { recruitments });
    } catch (error) {
      next(error);
    }
  }

  static async getRecruitmentById(req, res, next) {
    try {
      const { id } = req.params;
      const recruitment = await RecruitmentsService.getRecruitmentById(id);
      return sendSuccess(res, 200, 'Lấy thông tin đợt tuyển thành công', { recruitment });
    } catch (error) {
      next(error);
    }
  }

  static async createRecruitment(req, res, next) {
    try {
      const { clubId } = req.params;
      const recruitment = await RecruitmentsService.createRecruitment(clubId, req.body);
      return sendSuccess(res, 201, 'Tạo đợt tuyển và biểu mẫu thành công', { recruitment });
    } catch (error) {
      next(error);
    }
  }

  static async updateRecruitmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const recruitment = await RecruitmentsService.updateRecruitmentStatus(id, status);
      return sendSuccess(res, 200, 'Cập nhật trạng thái đợt tuyển thành công', { recruitment });
    } catch (error) {
      next(error);
    }
  }
}
