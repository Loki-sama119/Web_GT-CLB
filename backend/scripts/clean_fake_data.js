import prisma from '../src/config/db.js';

const OFFICIAL_CLUB_SLUGS = [
  'clb-bong-da-bafu',
  'clb-cau-long-badminton',
  'clb-lap-trinh-bafu-tech',
  'clb-am-nhac-melody',
  'clb-tieng-anh-bec',
  'clb-tinh-nguyen-xanh',
  'clb-bong-ro-bafu-hoops',
  'clb-nhiep-anh-bafu-lens',
  'clb-vo-thuat-taekwondo',
  'clb-mc-bafu-voice',
  'clb-khoi-nghiep-bafu',
  'clb-hien-mau-tinh-nguyen'
];

async function cleanFakeData() {
  console.log('🧹 Bắt đầu dọn dẹp toàn bộ dữ liệu ảo (test/mock) trong hệ thống...');

  // 1. Tìm tất cả user ảo (test.student.*, playwright.student.*, hoặc sinh viên tạo tự động khi chạy e2e)
  const fakeUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'test.student' } },
        { email: { contains: 'playwright' } },
        { email: { contains: 'test.' } }
      ]
    },
    select: { id: true, email: true }
  });

  const fakeUserIds = fakeUsers.map(u => u.id);
  console.log(`🔍 Tìm thấy ${fakeUserIds.length} tài khoản người dùng test/ảo.`);

  if (fakeUserIds.length > 0) {
    // Xóa câu trả lời ứng tuyển
    const delAnswers = await prisma.applicationAnswer.deleteMany({
      where: { application: { userId: { in: fakeUserIds } } }
    });
    console.log(` - Đã xóa ${delAnswers.count} câu trả lời đơn ứng tuyển của user ảo.`);

    // Xóa lịch sử trạng thái đơn
    const delHistories = await prisma.applicationHistory.deleteMany({
      where: {
        OR: [
          { application: { userId: { in: fakeUserIds } } },
          { changedById: { in: fakeUserIds } }
        ]
      }
    });
    console.log(` - Đã xóa ${delHistories.count} lịch sử hồ sơ liên quan.`);

    // Xóa đơn ứng tuyển
    const delApps = await prisma.application.deleteMany({
      where: { userId: { in: fakeUserIds } }
    });
    console.log(` - Đã xóa ${delApps.count} đơn ứng tuyển ảo.`);

    // Xóa đăng ký sự kiện
    const delRegs = await prisma.eventRegistration.deleteMany({
      where: { userId: { in: fakeUserIds } }
    });
    console.log(` - Đã xóa ${delRegs.count} đăng ký sự kiện của user ảo.`);

    // Xóa tư cách thành viên CLB
    const delMemberships = await prisma.clubMembership.deleteMany({
      where: { userId: { in: fakeUserIds } }
    });
    console.log(` - Đã xóa ${delMemberships.count} thành viên CLB ảo.`);

    // Xóa thông báo
    const delNotifs = await prisma.notification.deleteMany({
      where: { userId: { in: fakeUserIds } }
    });
    console.log(` - Đã xóa ${delNotifs.count} thông báo của user ảo.`);

    // Xóa hồ sơ sinh viên
    const delProfiles = await prisma.studentProfile.deleteMany({
      where: { userId: { in: fakeUserIds } }
    });
    console.log(` - Đã xóa ${delProfiles.count} hồ sơ sinh viên ảo.`);

    // Xóa user
    const delUsers = await prisma.user.deleteMany({
      where: { id: { in: fakeUserIds } }
    });
    console.log(`✅ Đã xóa hoàn toàn ${delUsers.count} tài khoản người dùng ảo.`);
  }

  // 2. Tìm và xóa các câu lạc bộ ảo tạo bởi test (không thuộc danh sách CLB chính thức)
  const fakeClubs = await prisma.club.findMany({
    where: {
      slug: { notIn: OFFICIAL_CLUB_SLUGS }
    },
    select: { id: true, name: true, slug: true }
  });

  console.log(`🔍 Tìm thấy ${fakeClubs.length} câu lạc bộ ảo (không thuộc danh mục chính thức).`);

  for (const fc of fakeClubs) {
    console.log(` - Đang xóa dữ liệu CLB ảo: "${fc.name}" (${fc.slug})...`);
    // Xóa medias
    await prisma.clubMedia.deleteMany({ where: { clubId: fc.id } });
    // Xóa bài viết
    await prisma.clubPost.deleteMany({ where: { clubId: fc.id } });
    // Xóa sự kiện và đăng ký sự kiện
    const events = await prisma.clubEvent.findMany({ where: { clubId: fc.id }, select: { id: true } });
    const eventIds = events.map(e => e.id);
    if (eventIds.length > 0) {
      await prisma.eventRegistration.deleteMany({ where: { eventId: { in: eventIds } } });
      await prisma.clubEvent.deleteMany({ where: { id: { in: eventIds } } });
    }
    // Xóa đơn và chiến dịch tuyển dụng
    const campaigns = await prisma.recruitmentCampaign.findMany({ where: { clubId: fc.id }, select: { id: true } });
    const campaignIds = campaigns.map(c => c.id);
    if (campaignIds.length > 0) {
      const apps = await prisma.application.findMany({ where: { campaignId: { in: campaignIds } }, select: { id: true } });
      const appIds = apps.map(a => a.id);
      if (appIds.length > 0) {
        await prisma.applicationAnswer.deleteMany({ where: { applicationId: { in: appIds } } });
        await prisma.applicationHistory.deleteMany({ where: { applicationId: { in: appIds } } });
        await prisma.application.deleteMany({ where: { id: { in: appIds } } });
      }
      const forms = await prisma.applicationForm.findMany({ where: { campaignId: { in: campaignIds } }, select: { id: true } });
      const formIds = forms.map(f => f.id);
      if (formIds.length > 0) {
        await prisma.formQuestion.deleteMany({ where: { formId: { in: formIds } } });
        await prisma.applicationForm.deleteMany({ where: { id: { in: formIds } } });
      }
      await prisma.recruitmentCampaign.deleteMany({ where: { id: { in: campaignIds } } });
    }
    // Xóa thành viên
    await prisma.clubMembership.deleteMany({ where: { clubId: fc.id } });
    // Xóa CLB
    await prisma.club.delete({ where: { id: fc.id } });
  }
  console.log(`✅ Đã xóa toàn bộ ${fakeClubs.length} câu lạc bộ ảo.`);

  // 3. Sửa đúng ảnh bìa chính thức cho CLB Lập Trình & Công Nghệ BAFU Tech
  const bafuTech = await prisma.club.findUnique({
    where: { slug: 'clb-lap-trinh-bafu-tech' }
  });
  if (bafuTech) {
    await prisma.club.update({
      where: { id: bafuTech.id },
      data: {
        coverUrl: '/images/bafu/bafu-computer-lab.jpg',
        shortDescription: 'Cộng đồng Tin học (IT BAFU) & Sáng tạo số — Nghiên cứu công nghệ, lập trình web, AI ứng dụng nông nghiệp.',
        description: 'BAFU Tech tổ chức các workshop chia sẻ kiến thức lập trình thực chiến, hỗ trợ làm đồ án môn học, tham gia các kỳ thi Hackathon và nghiên cứu khoa học sinh viên.'
      }
    });
    console.log('✅ Đã cập nhật ảnh bìa CHÍNH XÁC cho CLB BAFU Tech: /images/bafu/bafu-computer-lab.jpg (Phòng máy tính & thực hành CNTT BAFU)');
  }

  // 4. Đảm bảo các CLB chính thức khác có ảnh bìa chuẩn BAFU
  await prisma.club.updateMany({
    where: { slug: 'clb-bong-da-bafu' },
    data: { coverUrl: '/images/bafu/students-football-2025.jpg' }
  });
  await prisma.club.updateMany({
    where: { slug: 'clb-tinh-nguyen-xanh' },
    data: { coverUrl: '/images/bafu/students-welcome-2025.jpg' }
  });
  await prisma.club.updateMany({
    where: { slug: 'clb-khoi-nghiep-bafu' },
    data: { coverUrl: '/images/bafu/students-classroom-2025.jpg' }
  });
  await prisma.club.updateMany({
    where: { slug: 'clb-hien-mau-tinh-nguyen' },
    data: { coverUrl: '/images/bafu/campus-building-b5.jpg' }
  });

  console.log('🎉 Hoàn tất dọn dẹp sạch sẽ dữ liệu ảo và chuẩn hóa hình ảnh!');
}

cleanFakeData()
  .catch(e => {
    console.error('❌ Lỗi khi dọn dẹp:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
