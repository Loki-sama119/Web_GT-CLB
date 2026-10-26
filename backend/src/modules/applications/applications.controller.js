import { ApplicationsService } from './applications.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ApplicationsController {
  static async submitApplication(req, res, next) {
    try {
      const { campaignId } = req.params;
      const { answers } = req.body;
      const application = await ApplicationsService.submitApplication({
        campaignId,
        userId: req.user.id,
        answers
      });
      return sendSuccess(res, 201, 'Nộp hồ sơ ứng tuyển thành công', { application });
    } catch (error) {
      next(error);
    }
  }

  static async getMyApplications(req, res, next) {
    try {
      const applications = await ApplicationsService.getMyApplications(req.user.id);
      return sendSuccess(res, 200, 'Lấy danh sách hồ sơ ứng tuyển thành công', { applications });
    } catch (error) {
      next(error);
    }
  }

  static async getClubApplications(req, res, next) {
    try {
      const { clubId } = req.params;
      const { status, search, page, limit } = req.query;
      const { applications, meta } = await ApplicationsService.getClubApplications(clubId, { status, search, page, limit });
      return sendSuccess(res, 200, 'Lấy danh sách hồ sơ ứng tuyển của CLB thành công', { applications }, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getApplicationById(req, res, next) {
    try {
      const { id } = req.params;
      const application = await ApplicationsService.getApplicationById(id, req.user);
      return sendSuccess(res, 200, 'Lấy chi tiết hồ sơ thành công', { application });
    } catch (error) {
      next(error);
    }
  }

  static async reviewApplication(req, res, next) {
    try {
      const { id } = req.params;
      const { status, internalNotes } = req.body;
      const application = await ApplicationsService.reviewApplication(id, req.user.id, { status, internalNotes });
      return sendSuccess(res, 200, 'Cập nhật trạng thái xét duyệt hồ sơ thành công', { application });
    } catch (error) {
      next(error);
    }
  }

  static async withdrawApplication(req, res, next) {
    try {
      const { id } = req.params;
      const application = await ApplicationsService.withdrawApplication(id, req.user.id);
      return sendSuccess(res, 200, 'Rút hồ sơ ứng tuyển thành công', { application });
    } catch (error) {
      next(error);
    }
  }
}
