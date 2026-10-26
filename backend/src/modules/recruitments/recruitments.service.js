import prisma from '../../config/db.js';

export class RecruitmentsService {
  static async getClubRecruitments(clubId) {
    return prisma.recruitmentCampaign.findMany({
      where: { clubId },
      include: {
        form: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getRecruitmentById(id) {
    const campaign = await prisma.recruitmentCampaign.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true, name: true, slug: true, logoUrl: true }
        },
        form: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!campaign) {
      const err = new Error('Không tìm thấy đợt tuyển thành viên');
      err.statusCode = 404;
      throw err;
    }

    return campaign;
  }

  static async createRecruitment(clubId, data) {
    const slug = data.slug || `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;

    const campaign = await prisma.recruitmentCampaign.create({
      data: {
        clubId,
        title: data.title,
        slug,
        description: data.description,
        requirements: data.requirements || '',
        targetQuantity: Number(data.targetQuantity) || 0,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'DRAFT',
        form: {
          create: {
            title: data.formTitle || `Biểu mẫu đăng ký: ${data.title}`,
            description: data.formDescription || '',
            questions: {
              create: (data.questions || []).map((q, idx) => ({
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.options ? (typeof q.options === 'string' ? q.options : JSON.stringify(q.options)) : null,
                isRequired: q.isRequired !== undefined ? q.isRequired : true,
                orderIndex: idx + 1
              }))
            }
          }
        }
      },
      include: {
        form: {
          include: { questions: true }
        }
      }
    });

    return campaign;
  }

  static async updateRecruitmentStatus(id, status) {
    return prisma.recruitmentCampaign.update({
      where: { id },
      data: { status }
    });
  }
}
