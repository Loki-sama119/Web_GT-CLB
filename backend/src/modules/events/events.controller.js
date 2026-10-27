import { EventsService } from './events.service.js';
import { sendSuccess } from '../../utils/response.js';

export class EventsController {
  static async getEvents(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const { events, meta } = await EventsService.getEvents({ page, limit, status });
      return sendSuccess(res, 200, 'Lấy danh sách sự kiện thành công', { events }, meta);
    } catch (error) {
      next(error);
    }
  }

  static async registerEvent(req, res, next) {
    try {
      const { id } = req.params;
      const registration = await EventsService.registerEvent(id, req.user.id);
      return sendSuccess(res, 200, 'Đăng ký tham gia sự kiện thành công', { registration });
    } catch (error) {
      next(error);
    }
  }
}
