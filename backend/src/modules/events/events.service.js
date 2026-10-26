import prisma from '../../config/db.js';

export class EventsService {
  static async getEvents({ page = 1, limit = 10, status = 'UPCOMING' }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      isPublic: true,
      ...(status && { status })
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

  static async registerEvent(eventId, userId) {
    const event = await prisma.clubEvent.findUnique({
      where: { id: eventId },
      include: {
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

    if (event.maxParticipants > 0 && event._count.registrations >= event.maxParticipants) {
      const err = new Error('Sự kiện đã đạt tối đa số lượng người tham gia');
      err.statusCode = 400;
      throw err;
    }

    const registration = await prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      },
      update: { status: 'REGISTERED' },
      create: {
        eventId,
        userId,
        status: 'REGISTERED'
      }
    });

    return registration;
  }
}
