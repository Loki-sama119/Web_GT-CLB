import prisma from '../../config/db.js';
import { emailService } from '../email/email.service.js';

export class EventsService {
  // 1. Lấy danh sách sự kiện có lọc và phân trang
  static async getEvents({ clubId, page = 1, limit = 12, status, search }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      isPublic: true,
      ...(clubId && { clubId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [total, events] = await Promise.all([
      prisma.clubEvent.count({ where }),
      prisma.clubEvent.findMany({
        where,
        skip,
        take,
        include: {
          club: {
            select: { id: true, name: true, slug: true, logoUrl: true }
          },
          _count: {
            select: { registrations: true }
          }
        },
        orderBy: { startTime: 'asc' }
      })
    ]);

    return {
      events,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take)
      }
    };
  }

  // 2. Chi tiết sự kiện theo ID
  static async getEventById(id, userId = null) {
    const event = await prisma.clubEvent.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true, name: true, slug: true, logoUrl: true, email: true, phone: true }
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      const err = new Error('Sự kiện không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    let isRegistered = false;
    if (userId) {
      const reg = await prisma.eventRegistration.findUnique({
        where: { eventId_userId: { eventId: id, userId } }
      });
      isRegistered = reg?.status === 'REGISTERED';
    }

    return { ...event, isRegistered };
  }

  // 3. Tạo sự kiện mới cho CLB (BCN)
  static async createEvent(clubId, eventData) {
    const { title, description, location, startTime, endTime, maxParticipants = 0, isPublic = true } = eventData;

    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const event = await prisma.clubEvent.create({
      data: {
        clubId,
        title,
        slug,
        description: description || '',
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxParticipants: Number(maxParticipants),
        isPublic: isPublic !== false,
        status: 'UPCOMING'
      },
      include: {
        club: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return event;
  }

  // 4. Sinh viên đăng ký tham gia sự kiện
  static async registerEvent(eventId, userId) {
    const event = await prisma.clubEvent.findUnique({
      where: { id: eventId },
      include: {
        club: true,
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      const err = new Error('Sự kiện không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    if (event.status !== 'UPCOMING') {
      const err = new Error('Sự kiện này không mở đăng ký hoặc đã kết thúc');
      err.statusCode = 400;
      throw err;
    }

    if (event.maxParticipants > 0 && event._count.registrations >= event.maxParticipants) {
      const err = new Error('Sự kiện đã đạt tối đa số lượng người tham gia');
      err.statusCode = 400;
      throw err;
    }

    // Kiểm tra đăng ký trùng lặp
    const existing = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });

    if (existing && existing.status === 'REGISTERED') {
      const err = new Error('Bạn đã đăng ký tham gia sự kiện này rồi');
      err.statusCode = 400;
      throw err;
    }

    const registration = await prisma.eventRegistration.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: { status: 'REGISTERED', registeredAt: new Date() },
      create: {
        eventId,
        userId,
        status: 'REGISTERED'
      }
    });

    // Gửi email xác nhận đăng ký sự kiện (Bất đồng bộ an toàn)
    prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    }).then(user => {
      if (user?.email) {
        emailService.sendEventRegistrationConfirmed(
          user.email,
          user.studentProfile?.fullName || 'Sinh viên',
          event.title,
          event.club.name,
          event.location,
          event.startTime
        ).catch(err => console.error('Lỗi gửi email sự kiện:', err.message));
      }
    }).catch(() => {});

    return registration;
  }

  // 5. Hủy đăng ký tham gia sự kiện
  static async cancelRegistration(eventId, userId) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });

    if (!registration || registration.status !== 'REGISTERED') {
      const err = new Error('Bạn chưa đăng ký sự kiện này');
      err.statusCode = 400;
      throw err;
    }

    return prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED' }
    });
  }

  // 6. Lấy danh sách sự kiện của sinh viên hiện tại
  static async getMyRegistrations(userId) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId, status: 'REGISTERED' },
      include: {
        event: {
          include: {
            club: {
              select: { id: true, name: true, slug: true, logoUrl: true }
            }
          }
        }
      },
      orderBy: { registeredAt: 'desc' }
    });

    return registrations;
  }

  // 7. BCN xem danh sách người đăng ký sự kiện
  static async getEventRegistrations(eventId) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId, status: 'REGISTERED' },
      include: {
        user: {
          include: { studentProfile: true }
        }
      },
      orderBy: { registeredAt: 'asc' }
    });

    return registrations;
  }

  // 8. Cập nhật trạng thái sự kiện (UPCOMING, ONGOING, COMPLETED, CANCELLED)
  static async updateEventStatus(eventId, status) {
    const event = await prisma.clubEvent.update({
      where: { id: eventId },
      data: { status }
    });

    return event;
  }
}
