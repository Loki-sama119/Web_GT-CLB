import prisma from '../../config/db.js';
import { emailService } from '../email/email.service.js';

export class ApplicationsService {
  static async submitApplication({ campaignId, userId, answers = [] }) {
    // 1. Kiểm tra đợt tuyển
    const campaign = await prisma.recruitmentCampaign.findUnique({
      where: { id: campaignId },
      include: {
        club: true,
        form: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!campaign) {
      const err = new Error('Đợt tuyển thành viên không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    if (campaign.status !== 'OPEN') {
      const err = new Error('Đợt tuyển thành viên hiện không mở nhận đơn');
      err.statusCode = 400;
      throw err;
    }

    const now = new Date();
    if (now > campaign.endDate) {
      const err = new Error('Đợt tuyển thành viên này đã hết hạn nộp hồ sơ');
      err.statusCode = 400;
      throw err;
    }

    // 2. Kiểm tra tư cách thành viên hiện tại trong CLB
    const existingMembership = await prisma.clubMembership.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId: campaign.clubId
        }
      }
    });

    if (existingMembership && existingMembership.status === 'ACTIVE') {
      const err = new Error('Bạn đã là thành viên chính thức của câu lạc bộ này');
      err.statusCode = 400;
      throw err;
    }

    // 3. Kiểm tra đơn trùng lặp đang hoạt động
    const existingActiveApp = await prisma.application.findFirst({
      where: {
        campaignId,
        userId,
        status: {
          in: ['SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO', 'ACCEPTED']
        }
      }
    });

    if (existingActiveApp) {
      const err = new Error('Bạn đã có hồ sơ đang được xử lý trong đợt tuyển này');
      err.statusCode = 400;
      throw err;
    }

    // 4. Validate câu hỏi bắt buộc
    const questions = campaign.form?.questions || [];
    const answersMap = new Map();
    answers.forEach(a => answersMap.set(a.questionId, a.answerValue));

    for (const q of questions) {
      if (q.isRequired) {
        const ans = answersMap.get(q.id);
        if (ans === undefined || ans === null || String(ans).trim() === '') {
          const err = new Error(`Vui lòng trả lời câu hỏi bắt buộc: "${q.questionText}"`);
          err.statusCode = 400;
          throw err;
        }
      }
    }

    // 5. Lưu Application và các Answers
    const application = await prisma.application.create({
      data: {
        campaignId,
        userId,
        status: 'SUBMITTED',
        answers: {
          create: answers.map(a => {
            const matchedQuestion = questions.find(q => q.id === a.questionId);
            return {
              questionId: a.questionId,
              questionTextSnapshot: matchedQuestion ? matchedQuestion.questionText : 'Câu hỏi',
              answerValue: typeof a.answerValue === 'string' ? a.answerValue : JSON.stringify(a.answerValue)
            };
          })
        }
      },
      include: {
        campaign: {
          include: {
            club: {
              select: { id: true, name: true, slug: true }
            }
          }
        },
        answers: true
      }
    });

    // Tạo thông báo cho sinh viên
    await prisma.notification.create({
      data: {
        userId,
        title: 'Nộp hồ sơ thành công',
        content: `Bạn đã nộp thành công hồ sơ ứng tuyển vào CLB ${campaign.club.name} (${campaign.title}).`,
        type: 'RECRUITMENT',
        link: '/student/applications'
      }
    });

    // Ghi lịch sử nộp đơn ban đầu
    await prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        changedById: userId,
        fromStatus: 'DRAFT',
        toStatus: 'SUBMITTED',
        notes: 'Sinh viên nộp hồ sơ trực tuyến'
      }
    });

    // Gửi email xác nhận nộp hồ sơ (Bất đồng bộ an toàn)
    prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    }).then(applicantUser => {
      if (applicantUser?.email) {
        emailService.sendApplicationSubmitted(
          applicantUser.email,
          applicantUser.studentProfile?.fullName || 'Sinh viên',
          campaign.club.name,
          campaign.title
        ).catch(err => console.error('Lỗi gửi email nộp đơn:', err.message));
      }
    }).catch(() => {});

    return application;
  }

  static async getMyApplications(userId) {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        campaign: {
          include: {
            club: {
              select: { id: true, name: true, slug: true, logoUrl: true }
            }
          }
        },
        answers: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    // Tuyệt đối ẩn internalNotes với sinh viên
    return applications.map(app => {
      const { internalNotes, ...safeApp } = app;
      return safeApp;
    });
  }

  static async getClubApplications(clubId, { status, search, page = 1, limit = 20 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      campaign: {
        clubId
      },
      ...(status && { status }),
      ...(search && {
        user: {
          studentProfile: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { studentCode: { contains: search, mode: 'insensitive' } },
              { faculty: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      })
    };

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            include: {
              studentProfile: true
            }
          },
          campaign: {
            select: { id: true, title: true }
          },
          answers: true
        },
        orderBy: { submittedAt: 'desc' }
      })
    ]);

    return {
      applications,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take)
      }
    };
  }

  static async getApplicationById(id, currentUser) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            studentProfile: true
          }
        },
        campaign: {
          include: {
            club: true
          }
        },
        answers: true,
        histories: {
          include: {
            changedBy: {
              select: {
                id: true,
                email: true,
                studentProfile: {
                  select: { fullName: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!application) {
      const err = new Error('Không tìm thấy hồ sơ ứng tuyển');
      err.statusCode = 404;
      throw err;
    }

    const isOwner = application.userId === currentUser.id;
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    // Kiểm tra nếu là Club Admin của CLB này
    const isClubAdmin = currentUser.memberships?.some(
      m => m.clubId === application.campaign.clubId && ['LEADER', 'VICE_LEADER'].includes(m.role)
    );

    if (!isOwner && !isSuperAdmin && !isClubAdmin) {
      const err = new Error('Bạn không có quyền xem hồ sơ này');
      err.statusCode = 403;
      throw err;
    }

    // Nếu là sinh viên sở hữu đơn, ẩn internalNotes
    if (isOwner && !isClubAdmin && !isSuperAdmin) {
      const { internalNotes, ...safeApp } = application;
      return safeApp;
    }

    return application;
  }

  static async reviewApplication(applicationId, reviewerId, { status, internalNotes }) {
    // 1. Tìm đơn hiện tại
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        campaign: {
          include: { club: true }
        }
      }
    });

    if (!application) {
      const err = new Error('Hồ sơ ứng tuyển không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    const clubId = application.campaign.club.id;
    const clubName = application.campaign.club.name;

    // 2. Thực hiện cập nhật trong Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái đơn
      const updatedApp = await tx.application.update({
        where: { id: applicationId },
        data: {
          status,
          internalNotes: internalNotes !== undefined ? internalNotes : application.internalNotes,
          reviewedAt: new Date(),
          reviewedByUserId: reviewerId
        }
      });

      // Lưu lịch sử thay đổi trạng thái
      await tx.applicationHistory.create({
        data: {
          applicationId,
          changedById: reviewerId,
          fromStatus: application.status,
          toStatus: status,
          notes: internalNotes || null
        }
      });

      // Nếu ACCEPTED: Tạo ClubMembership (ngăn trùng lặp)
      if (status === 'ACCEPTED') {
        const existingMember = await tx.clubMembership.findUnique({
          where: {
            userId_clubId: {
              userId: application.userId,
              clubId
            }
          }
        });

        if (!existingMember) {
          await tx.clubMembership.create({
            data: {
              userId: application.userId,
              clubId,
              role: 'MEMBER',
              status: 'ACTIVE'
            }
          });
        } else if (existingMember.status !== 'ACTIVE') {
          await tx.clubMembership.update({
            where: { id: existingMember.id },
            data: { status: 'ACTIVE', role: 'MEMBER' }
          });
        }

        // Bắn thông báo chúc mừng
        await tx.notification.create({
          data: {
            userId: application.userId,
            title: `🎉 Chúc mừng bạn đã trúng tuyển vào CLB ${clubName}!`,
            content: `Hồ sơ của bạn đã được Ban chủ nhiệm xét duyệt thành công. Bạn hiện là thành viên chính thức của CLB.`,
            type: 'MEMBERSHIP',
            link: `/clubs/${application.campaign.club.slug}`
          }
        });
      } else if (status === 'REJECTED') {
        await tx.notification.create({
          data: {
            userId: application.userId,
            title: `Thông báo kết quả ứng tuyển CLB ${clubName}`,
            content: `Cảm ơn bạn đã quan tâm ứng tuyển. Rất tiếc hiện tại hồ sơ chưa phù hợp với đợt tuyển này. Hẹn gặp lại bạn ở các đợt tuyển sau!`,
            type: 'RECRUITMENT',
            link: '/student/applications'
          }
        });
      } else if (status === 'NEED_MORE_INFO') {
        await tx.notification.create({
          data: {
            userId: application.userId,
            title: `Yêu cầu bổ sung hồ sơ từ CLB ${clubName}`,
            content: `Ban chủ nhiệm cần bạn bổ sung thêm một số thông tin cho hồ sơ ứng tuyển. Vui lòng kiểm tra lại.`,
            type: 'RECRUITMENT',
            link: '/student/applications'
          }
        });
      }

      // Ghi Audit Log
      await tx.auditLog.create({
        data: {
          userId: reviewerId,
          action: `REVIEW_APPLICATION_${status}`,
          entityType: 'Application',
          entityId: applicationId,
          details: JSON.stringify({
            previousStatus: application.status,
            newStatus: status,
            applicantId: application.userId,
            clubId
          })
        }
      });

      return updatedApp;
    });

    // Gửi email thông báo kết quả (Bất đồng bộ an toàn sau khi commit transaction)
    prisma.user.findUnique({
      where: { id: application.userId },
      include: { studentProfile: true }
    }).then(applicantUser => {
      if (applicantUser?.email) {
        const studentName = applicantUser.studentProfile?.fullName || 'Sinh viên';
        if (status === 'ACCEPTED') {
          emailService.sendApplicationAccepted(applicantUser.email, studentName, clubName)
            .catch(err => console.error('Lỗi gửi email trúng tuyển:', err.message));
        } else if (status === 'REJECTED') {
          emailService.sendApplicationRejected(applicantUser.email, studentName, clubName)
            .catch(err => console.error('Lỗi gửi email từ chối:', err.message));
        } else if (status === 'NEED_MORE_INFO') {
          emailService.sendApplicationNeedMoreInfo(applicantUser.email, studentName, clubName)
            .catch(err => console.error('Lỗi gửi email bổ sung hồ sơ:', err.message));
        }
      }
    }).catch(() => {});

    return result;
  }

  static async withdrawApplication(applicationId, userId) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application || application.userId !== userId) {
      const err = new Error('Hồ sơ không tồn tại hoặc bạn không có quyền');
      err.statusCode = 404;
      throw err;
    }

    if (application.status === 'ACCEPTED') {
      const err = new Error('Không thể rút hồ sơ đã được xét duyệt trúng tuyển');
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      await tx.applicationHistory.create({
        data: {
          applicationId,
          changedById: userId,
          fromStatus: application.status,
          toStatus: 'WITHDRAWN',
          notes: 'Sinh viên chủ động rút đơn ứng tuyển'
        }
      });

      return tx.application.update({
        where: { id: applicationId },
        data: { status: 'WITHDRAWN' }
      });
    });
  }

  static async exportClubApplications(clubId) {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { name: true, slug: true }
    });

    if (!club) {
      const err = new Error('Câu lạc bộ không tồn tại');
      err.statusCode = 404;
      throw err;
    }

    const applications = await prisma.application.findMany({
      where: { campaign: { clubId } },
      include: {
        user: { include: { studentProfile: true } },
        campaign: { select: { title: true } },
        answers: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    const headers = [
      'STT',
      'Họ Và Tên',
      'Mã Sinh Viên',
      'Email',
      'Số Điện Thoại',
      'Khoa/Ngành',
      'Chiến Dịch Tuyển',
      'Ngày Nộp',
      'Trạng Thái',
      'Nội Dung Trả Lời'
    ];

    // Mitigate CSV Formula Injection (OWASP ASVS): prepend single quote if cell starts with dangerous formula chars
    const escape = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = applications.map((app, index) => {
      const profile = app.user?.studentProfile;
      const statusMap = {
        SUBMITTED: 'Đã nộp đơn',
        UNDER_REVIEW: 'Đang xét duyệt',
        NEED_MORE_INFO: 'Cần bổ sung',
        ACCEPTED: 'Trúng tuyển',
        REJECTED: 'Chưa phù hợp',
        WITHDRAWN: 'Đã rút đơn'
      };

      const answerSummary = (app.answers || [])
        .map(a => `${a.questionTextSnapshot}: ${a.answerValue}`)
        .join(' | ');

      return [
        index + 1,
        escape(profile?.fullName || 'N/A'),
        escape(profile?.studentCode || 'N/A'),
        escape(app.user?.email || 'N/A'),
        escape(profile?.phone || 'N/A'),
        escape(profile?.faculty || 'N/A'),
        escape(app.campaign?.title || 'N/A'),
        escape(new Date(app.submittedAt).toLocaleDateString('vi-VN')),
        escape(statusMap[app.status] || app.status),
        escape(answerSummary)
      ].join(',');
    });

    const bom = '\uFEFF';
    const csvContent = bom + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
    const filename = `danh-sach-ung-vien-${club.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

    return { filename, csvContent };
  }
}
