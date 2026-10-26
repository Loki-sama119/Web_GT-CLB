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
});
