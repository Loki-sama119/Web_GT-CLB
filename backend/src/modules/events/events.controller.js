import { EventsService } from './events.service.js';
import { sendSuccess } from '../../utils/response.js';

export class EventsController {
  // Lấy danh sách sự kiện
  static async getEvents(req, res, next) {
    try {
      const { page, limit, status, clubId, search } = req.query;
      const { events, meta } = await EventsService.getEvents({ page, limit, status, clubId, search });
      return sendSuccess(res, 200, 'Lấy danh sách sự kiện thành công', { events }, meta);
    } catch (error) {
      next(error);
    }
  }

  // Xem chi tiết sự kiện
  static async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;
      const event = await EventsService.getEventById(id, userId);
      return sendSuccess(res, 200, 'Lấy chi tiết sự kiện thành công', { event });
    } catch (error) {
      next(error);
    }
  }

  // Tạo sự kiện mới cho CLB
  static async createEvent(req, res, next) {
    try {
      const { clubId } = req.params;
      const event = await EventsService.createEvent(clubId, req.body);
      return sendSuccess(res, 201, 'Tạo sự kiện thành công', { event });
    } catch (error) {
      next(error);
    }
  }

  // Đăng ký tham gia sự kiện
  static async registerEvent(req, res, next) {
    try {
      const { id } = req.params;
      const registration = await EventsService.registerEvent(id, req.user.id);
      return sendSuccess(res, 200, 'Đăng ký tham gia sự kiện thành công', { registration });
    } catch (error) {
      next(error);
    }
  }

  // Hủy đăng ký sự kiện
  static async cancelRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const registration = await EventsService.cancelRegistration(id, req.user.id);
      return sendSuccess(res, 200, 'Hủy đăng ký sự kiện thành công', { registration });
    } catch (error) {
      next(error);
    }
  }

  // Sinh viên xem các sự kiện đã đăng ký
  static async getMyRegistrations(req, res, next) {
    try {
      const registrations = await EventsService.getMyRegistrations(req.user.id);
      return sendSuccess(res, 200, 'Lấy danh sách sự kiện đã đăng ký thành công', { registrations });
    } catch (error) {
      next(error);
    }
  }

  // BCN xem danh sách người đăng ký
  static async getEventRegistrations(req, res, next) {
    try {
      const { id } = req.params;
      const registrations = await EventsService.getEventRegistrations(id);
      return sendSuccess(res, 200, 'Lấy danh sách người đăng ký sự kiện thành công', { registrations });
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật trạng thái sự kiện
  static async updateEventStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const event = await EventsService.updateEventStatus(id, status);
      return sendSuccess(res, 200, 'Cập nhật trạng thái sự kiện thành công', { event });
    } catch (error) {
      next(error);
    }
  }
}
