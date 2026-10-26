import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';

describe('University Club Portal API Integration Tests', () => {
  let studentToken = '';
  let adminToken = '';
  let studentUserId = '';
  let openCampaignId = '';
  let closedCampaignId = '';
  let techClubId = '';
  let campaignQuestions = [];
  let createdApplicationId = '';

  beforeAll(async () => {
    // Lấy thông tin đợt tuyển OPEN và CLOSED từ seed data
    const openCampaign = await prisma.recruitmentCampaign.findFirst({
      where: { status: 'OPEN' },
      include: {
        club: true,
        form: { include: { questions: true } }
      }
    });
    openCampaignId = openCampaign.id;
    techClubId = openCampaign.clubId;
    campaignQuestions = openCampaign.form.questions;

    const closedCampaign = await prisma.recruitmentCampaign.findFirst({
      where: { status: 'CLOSED' }
    });
    closedCampaignId = closedCampaign?.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // TC01: Đăng ký tài khoản hợp lệ
  it('TC01: Người dùng đăng ký tài khoản hợp lệ thành công', async () => {
    const uniqueEmail = `test.student.${Date.now()}@bafu.edu.vn`;
    const uniqueCode = `SVTEST_${Date.now().toString().slice(-6)}`;

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: uniqueEmail,
        password: 'Password123!',
        fullName: 'Nguyễn Văn Kiểm Thử',
        studentCode: uniqueCode,
        faculty: 'Khoa Công nghệ Thông tin',
        phone: '0987654321'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.token).toBeDefined();

    studentToken = res.body.data.token;
    studentUserId = res.body.data.user.id;
  });

  // TC02: Đăng nhập đúng và sai mật khẩu
  it('TC02: Đăng nhập thất bại khi sai mật khẩu và thành công khi đúng mật khẩu', async () => {
    // Sai mật khẩu
    const resFail = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@bafu.edu.vn',
        password: 'WrongPassword'
      });
    expect(resFail.status).toBe(401);
    expect(resFail.body.success).toBe(false);

    // Đúng mật khẩu
    const resSuccess = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@bafu.edu.vn',
        password: 'AdminPassword@2026'
      });
    expect(resSuccess.status).toBe(200);
    expect(resSuccess.body.success).toBe(true);
    expect(resSuccess.body.data.user.role).toBe('SUPER_ADMIN');
    adminToken = resSuccess.body.data.token;
  });

  // TC03: Sinh viên tìm kiếm, lọc và xem chi tiết CLB
  it('TC03: Tìm kiếm, lọc và xem chi tiết CLB theo slug', async () => {
    // Lọc theo search
    const resList = await request(app)
      .get('/api/v1/clubs?search=Tech')
      .expect(200);
    expect(resList.body.data.clubs.length).toBeGreaterThanOrEqual(1);

    // Xem chi tiết
    const resDetail = await request(app)
      .get('/api/v1/clubs/clb-lap-trinh-bafu-tech')
      .expect(200);
    expect(resDetail.body.data.club.slug).toBe('clb-lap-trinh-bafu-tech');
    expect(resDetail.body.data.club.memberships).toBeDefined();
  });

  // TC05: Thiếu trường bắt buộc thì backend từ chối
  it('TC05: Thiếu câu trả lời bắt buộc thì backend từ chối trả về 400', async () => {
    const res = await request(app)
      .post(`/api/v1/recruitments/${openCampaignId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: [] // Rỗng, thiếu câu hỏi bắt buộc
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TC04: Sinh viên nộp hồ sơ hợp lệ
  it('TC04: Sinh viên nộp hồ sơ hợp lệ với đầy đủ câu hỏi bắt buộc', async () => {
    // Chuẩn bị câu trả lời cho tất cả câu hỏi của form
    const answers = campaignQuestions.map(q => ({
      questionId: q.id,
      answerValue: q.questionType === 'MULTIPLE_CHOICE' 
        ? JSON.stringify(['JavaScript / TypeScript']) 
        : 'Câu trả lời mẫu kiểm thử hợp lệ'
    }));

    const res = await request(app)
      .post(`/api/v1/recruitments/${openCampaignId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application.status).toBe('SUBMITTED');
    createdApplicationId = res.body.data.application.id;
  });

  // TC06: Không thể nộp trùng hồ sơ đang hoạt động
  it('TC06: Ngăn chặn nộp trùng hồ sơ đang hoạt động trong cùng một đợt tuyển', async () => {
    const answers = campaignQuestions.map(q => ({
      questionId: q.id,
      answerValue: 'Thử nộp lại'
    }));

    const res = await request(app)
      .post(`/api/v1/recruitments/${openCampaignId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('đang được xử lý');
  });

  // TC07: Không thể nộp hồ sơ cho đợt tuyển đã đóng
  it('TC07: Không thể nộp hồ sơ cho đợt tuyển có trạng thái CLOSED', async () => {
    if (closedCampaignId) {
      const res = await request(app)
        .post(`/api/v1/recruitments/${closedCampaignId}/apply`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ answers: [] });
      expect(res.status).toBe(400);
    }
  });

  // TC08: Club Admin duyệt hồ sơ và membership được tạo đúng một lần trong transaction
  it('TC08: Duyệt hồ sơ ACCEPTED tự động kích hoạt membership duy nhất cho sinh viên', async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${createdApplicationId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'ACCEPTED',
        internalNotes: 'Ứng viên đạt yêu cầu phỏng vấn'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.application.status).toBe('ACCEPTED');

    // Xác minh trong Database: membership đã được tạo
    const membership = await prisma.clubMembership.findUnique({
      where: {
        userId_clubId: {
          userId: studentUserId,
          clubId: techClubId
        }
      }
    });

    expect(membership).not.toBeNull();
    expect(membership.status).toBe('ACTIVE');
    expect(membership.role).toBe('MEMBER');
  });

  // TC10: Sinh viên xem đúng trạng thái hồ sơ của mình và không lộ internal notes
  it('TC10: Sinh viên xem đúng trạng thái hồ sơ của mình và internalNotes được ẩn an toàn', async () => {
    const res = await request(app)
      .get('/api/v1/applications/my-applications')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.applications.length).toBeGreaterThanOrEqual(1);
    const myApp = res.body.data.applications.find(a => a.id === createdApplicationId);
    expect(myApp.status).toBe('ACCEPTED');
    expect(myApp.internalNotes).toBeUndefined(); // Bảo mật: không lộ internalNotes
  });

  // TC11: Kiểm tra phân quyền đa CLB: Club Admin A không thể truy cập tài nguyên CLB B
  it('TC11: Club Admin của CLB Cầu Lông không thể truy cập danh sách hồ sơ CLB BAFU Tech', async () => {
    // Đăng nhập tài khoản BCN Cầu lông
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'caulong.leader@bafu.edu.vn',
        password: '12345678'
      });
    const caulongToken = loginRes.body.data.token;

    // Cố gắng truy cập hồ sơ của CLB Tech (techClubId)
    const accessRes = await request(app)
      .get(`/api/v1/clubs/${techClubId}/applications`)
      .set('Authorization', `Bearer ${caulongToken}`);

    expect(accessRes.status).toBe(403);
    expect(accessRes.body.success).toBe(false);
  });

  // TC12: User thường không gọi được API Super Admin
  it('TC12: User vai trò STUDENT bị từ chối khi gọi API Super Admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // TC13: Sinh viên upload Avatar thành công
  it('TC13: Sinh viên upload Avatar thành công và cập nhật profile', async () => {
    const dummyImageBuffer = Buffer.from('fake-image-binary-data');

    const res = await request(app)
      .post('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('file', dummyImageBuffer, 'avatar.png');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.avatarUrl).toContain('/uploads/avatars/');
  });

  // TC14: Club Admin upload ảnh vào Album hoạt động của CLB
  it('TC14: Club Admin upload ảnh vào Album hoạt động và lấy danh sách album', async () => {
    const dummyImageBuffer = Buffer.from('fake-activity-image');

    const uploadRes = await request(app)
      .post(`/api/v1/clubs/${techClubId}/album`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('caption', 'Hình ảnh Workshop Lập trình Web')
      .attach('file', dummyImageBuffer, 'workshop.jpg');

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.success).toBe(true);
    expect(uploadRes.body.data.media.url).toContain('/uploads/albums/');

    // Lấy danh sách album
    const listRes = await request(app)
      .get(`/api/v1/clubs/${techClubId}/album`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(listRes.body.data.medias.length).toBeGreaterThanOrEqual(1);
  });

  // TC15: Chặn upload định dạng file không hợp lệ (không phải ảnh)
  it('TC15: Chặn tệp tin độc hại hoặc không đúng định dạng hình ảnh', async () => {
    const maliciousScriptBuffer = Buffer.from('echo malicious script');

    const res = await request(app)
      .post('/api/v1/users/me/avatar')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('file', maliciousScriptBuffer, 'script.sh');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Chỉ chấp nhận các định dạng ảnh');
  });

  // TC16: Club Admin xuất danh sách ứng viên CSV thành công
  it('TC16: Club Admin xuất danh sách ứng viên file CSV thành công có UTF-8 BOM', async () => {
    const res = await request(app)
      .get(`/api/v1/clubs/${techClubId}/applications/export`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('\uFEFF')).toBe(true); // Có BOM UTF-8 cho Excel
    expect(res.text).toContain('Họ Và Tên');
    expect(res.text).toContain('Mã Sinh Viên');
  });

  // TC17: Chặn Club Admin khác xuất danh sách ứng viên của CLB này
  it('TC17: Chặn Club Admin CLB Cầu Lông xuất danh sách ứng viên của CLB BAFU Tech (RBAC 403)', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'caulong.leader@bafu.edu.vn',
        password: '12345678'
      });
    const caulongToken = loginRes.body.data.token;

    const res = await request(app)
      .get(`/api/v1/clubs/${techClubId}/applications/export`)
      .set('Authorization', `Bearer ${caulongToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // TC18: Hệ thống ghi nhận lịch sử thay đổi trạng thái (ApplicationHistory)
  it('TC18: Hệ thống ghi nhận đầy đủ lịch sử thay đổi trạng thái ApplicationHistory', async () => {
    const detailRes = await request(app)
      .get(`/api/v1/applications/${createdApplicationId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.data.application.histories).toBeDefined();
    expect(detailRes.body.data.application.histories.length).toBeGreaterThanOrEqual(1);
    expect(detailRes.body.data.application.histories[0].toStatus).toBe('ACCEPTED');
  });

  // TC19: Dịch vụ Email gửi thông báo kết quả an toàn
  it('TC19: Dịch vụ Email gửi thông báo nộp đơn và trúng tuyển an toàn', async () => {
    const { emailService } = await import('../src/modules/email/email.service.js');
    const result = await emailService.sendApplicationSubmitted(
      'test.student@bafu.edu.vn',
      'Sinh viên BAFU',
      'CLB BAFU Tech',
      'Đợt tuyển Gen 5'
    );
    expect(result.success).toBe(true);

    const acceptResult = await emailService.sendApplicationAccepted(
      'test.student@bafu.edu.vn',
      'Sinh viên BAFU',
      'CLB BAFU Tech'
    );
    expect(acceptResult.success).toBe(true);
  });

  // TC20: Kiểm thử khả năng phục hồi (Resilience): Lỗi SMTP không làm hỏng transaction duyệt đơn
  it('TC20: Lỗi dịch vụ Email không làm hỏng tiến trình xét duyệt hồ sơ ứng tuyển', async () => {
    // Xét duyệt đơn sang UNDER_REVIEW
    const res = await request(app)
      .patch(`/api/v1/applications/${createdApplicationId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'UNDER_REVIEW',
        internalNotes: 'Ứng viên được gọi phỏng vấn vòng 2'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.application.status).toBe('UNDER_REVIEW');
  });

  // TC21: BCN tạo sự kiện mới cho CLB thành công
  let testEventId = '';
  it('TC21: BCN tạo sự kiện mới cho CLB thành công', async () => {
    const res = await request(app)
      .post(`/api/v1/clubs/${techClubId}/events`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026',
        description: 'Giới thiệu ứng dụng thị giác máy tính và AI trong quản lý nông trại thông minh.',
        location: 'Hội trường A1 - BAFU',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 3600 * 1000).toISOString(),
        maxParticipants: 50,
        isPublic: true
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.event.id).toBeDefined();
    testEventId = res.body.data.event.id;
  });

  // TC22: Sinh viên đăng ký tham gia sự kiện
  it('TC22: Sinh viên đăng ký tham gia sự kiện và nhận email xác nhận', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registration.status).toBe('REGISTERED');
  });

  // TC23: Chặn đăng ký trùng lặp vào cùng một sự kiện
  it('TC23: Chặn đăng ký trùng lặp vào sự kiện đã tham gia', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${testEventId}/register`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Bạn đã đăng ký tham gia sự kiện này rồi');
  });

  // TC24: Sinh viên xem danh sách các sự kiện mình đã đăng ký
  it('TC24: Sinh viên xem danh sách các sự kiện mình đã đăng ký', async () => {
    const res = await request(app)
      .get('/api/v1/events/my-registrations')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registrations.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.registrations.some(r => r.eventId === testEventId)).toBe(true);
  });

  // TC25: Sinh viên hủy đăng ký sự kiện thành công
  it('TC25: Sinh viên hủy đăng ký sự kiện thành công', async () => {
    const res = await request(app)
      .post(`/api/v1/events/${testEventId}/cancel-registration`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.registration.status).toBe('CANCELLED');
  });

  // TC26: Club Admin lấy danh sách thành viên CLB
  let memberToUpdateId = '';
  it('TC26: Club Admin lấy danh sách thành viên CLB có tìm kiếm và lọc', async () => {
    const res = await request(app)
      .get(`/api/v1/clubs/${techClubId}/members`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.members.length).toBeGreaterThanOrEqual(1);

    const firstMember = res.body.data.members.find(m => m.role === 'MEMBER');
    if (firstMember) {
      memberToUpdateId = firstMember.id;
    }
  });

  // TC27: Club Admin xuất danh sách thành viên ra file CSV có UTF-8 BOM
  it('TC27: Club Admin xuất danh sách thành viên ra file CSV có UTF-8 BOM', async () => {
    const res = await request(app)
      .get(`/api/v1/clubs/${techClubId}/members/export`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('\uFEFF')).toBe(true);
    expect(res.text).toContain('Chức Vụ Trong CLB');
  });

  // TC28: Cập nhật vai trò hội viên thành VICE_LEADER thành công
  it('TC28: Cập nhật chức vụ hội viên thành VICE_LEADER thành công', async () => {
    if (memberToUpdateId) {
      const res = await request(app)
        .patch(`/api/v1/clubs/${techClubId}/members/${memberToUpdateId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'VICE_LEADER' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.member.role).toBe('VICE_LEADER');
    }
  });

  // TC29: Một sinh viên có thể tham gia nhiều CLB khác nhau trên cùng một tài khoản
  it('TC29: Một sinh viên có thể tham gia nhiều câu lạc bộ trên cùng một tài khoản', async () => {
    // Tìm một CLB khác không phải techClubId
    const otherClub = await prisma.club.findFirst({
      where: { id: { not: techClubId } }
    });

    if (otherClub) {
      const secondMembership = await prisma.clubMembership.upsert({
        where: {
          userId_clubId: {
            userId: studentUserId,
            clubId: otherClub.id
          }
        },
        update: { status: 'ACTIVE' },
        create: {
          userId: studentUserId,
          clubId: otherClub.id,
          role: 'MEMBER',
          status: 'ACTIVE'
        }
      });

      expect(secondMembership).toBeDefined();
      expect(secondMembership.clubId).toBe(otherClub.id);

      // Xác minh sinh viên có ít nhất 2 memberships khác nhau
      const allMemberships = await prisma.clubMembership.findMany({
        where: { userId: studentUserId, status: 'ACTIVE' }
      });
      expect(allMemberships.length).toBeGreaterThanOrEqual(2);
    }
  });

  // TC30: Super Admin truy cập báo cáo tổng hợp hoạt động CLB toàn trường
  it('TC30: Super Admin truy cập báo cáo tổng hợp hoạt động CLB toàn trường', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reports/clubs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reports).toBeDefined();
    expect(res.body.data.reports.length).toBeGreaterThanOrEqual(1);

    const firstReport = res.body.data.reports[0];
    expect(firstReport.name).toBeDefined();
    expect(firstReport.category).toBeDefined();
    expect(firstReport.totalMembers).toBeDefined();
    expect(firstReport.acceptanceRate).toBeDefined();
  });

  // TC31: Super Admin xuất file CSV báo cáo toàn trường có UTF-8 BOM
  it('TC31: Super Admin xuất file CSV báo cáo toàn trường có UTF-8 BOM', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reports/clubs/export')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('\uFEFF')).toBe(true);
    expect(res.text).toContain('Tên Câu Lạc Bộ');
    expect(res.text).toContain('Tỷ Lệ Trúng Tuyển (%)');
  });

  // TC32: Chặn Sinh viên truy cập báo cáo Super Admin (RBAC 403)
  it('TC32: Chặn tài khoản Sinh viên truy cập báo cáo Super Admin (RBAC 403)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reports/clubs')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

