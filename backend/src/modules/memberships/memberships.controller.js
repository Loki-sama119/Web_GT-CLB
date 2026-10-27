import { MembershipsService } from './memberships.service.js';
import { sendSuccess } from '../../utils/response.js';

export class MembershipsController {
  static async getClubMembers(req, res, next) {
    try {
      const { clubId } = req.params;
      const { search, role, status } = req.query;
      const members = await MembershipsService.getClubMembers(clubId, { search, role, status });
      return sendSuccess(res, 200, 'Lấy danh sách thành viên CLB thành công', { members });
    } catch (error) {
      next(error);
    }
  }

  static async updateMemberRole(req, res, next) {
    try {
      const { clubId, memberId } = req.params;
      const { role } = req.body;
      const updated = await MembershipsService.updateMemberRole(clubId, memberId, role);
      return sendSuccess(res, 200, 'Cập nhật chức vụ thành viên thành công', { member: updated });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req, res, next) {
    try {
      const { clubId, memberId } = req.params;
      await MembershipsService.removeMember(clubId, memberId);
      return sendSuccess(res, 200, 'Xóa thành viên khỏi câu lạc bộ thành công');
    } catch (error) {
      next(error);
    }
  }

  static async exportClubMembers(req, res, next) {
    try {
      const { clubId } = req.params;
      const { filename, csvContent } = await MembershipsService.exportClubMembers(clubId);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }
}
