import prisma from '../../config/db.js';

export class ClubsService {
  static async getCategories() {
    return prisma.clubCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { clubs: true }
        }
      }
    });
  }

  static async getClubs({ category, search, recruiting, page = 1, limit = 12 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      status: 'ACTIVE',
      ...(category && {
        category: {
          slug: category
        }
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(recruiting === 'true' && {
        campaigns: {
          some: {
            status: 'OPEN',
            endDate: { gte: new Date() }
          }
        }
      })
    };

    const [total, clubs] = await Promise.all([
      prisma.club.count({ where }),
      prisma.club.findMany({
        where,
        skip,
        take,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true }
          },
          _count: {
            select: {
              memberships: { where: { status: 'ACTIVE' } },
              campaigns: { where: { status: 'OPEN', endDate: { gte: new Date() } } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      clubs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take)
      }
    };
  }

  static async getClubBySlug(slug) {
    const club = await prisma.club.findUnique({
      where: { slug },
      include: {
        category: true,
        memberships: {
          where: {
            status: 'ACTIVE',
            role: { in: ['LEADER', 'VICE_LEADER'] }
          },
          include: {
            user: {
              include: {
                studentProfile: true
              }
            }
          }
        },
        campaigns: {
          where: {
            status: 'OPEN',
            endDate: { gte: new Date() }
          },
          include: {
            form: {
              include: {
                questions: {
                  orderBy: { orderIndex: 'asc' }
                }
              }
            }
          }
        },
        events: {
          where: {
            status: 'UPCOMING'
          },
          orderBy: { startTime: 'asc' },
          take: 3
        },
        posts: {
          where: {
            status: 'PUBLISHED'
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            memberships: { where: { status: 'ACTIVE' } },
            events: true,
            posts: true
          }
        }
      }
    });

    if (!club) {
      const err = new Error('Không tìm thấy câu lạc bộ với đường dẫn này');
      err.statusCode = 404;
      throw err;
    }

    return club;
  }

  static async createClub(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return prisma.club.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        meetingSchedule: data.meetingSchedule || '',
        email: data.email || null,
        phone: data.phone || null,
        fanpageUrl: data.fanpageUrl || null,
        status: data.status || 'ACTIVE'
      }
    });
  }

  static async updateClub(clubId, data) {
    return prisma.club.update({
      where: { id: clubId },
      data
    });
  }
}
