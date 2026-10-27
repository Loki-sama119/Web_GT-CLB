import prisma from '../src/config/db.js';

async function main() {
  console.log('🔄 Bắt đầu đồng bộ dữ liệu CLB thực tế và chuẩn hóa BAFU Assets...');

  // 1. Cập nhật ảnh bìa thực tế cho các CLB đã có ảnh xác minh từ nhà trường
  await prisma.club.updateMany({
    where: { slug: 'clb-bong-da-bafu' },
    data: {
      coverUrl: '/images/bafu/students-football-2025.jpg',
      shortDescription: 'Tập hợp các tài năng bóng đá sinh viên BAFU, đại diện thi đấu giải BAFU Cup và các giải phong trào toàn tỉnh.'
    }
  });
  console.log('✅ Đã gắn ảnh bìa chính thức cho CLB Bóng Đá BAFU (students-football-2025.jpg)');

  await prisma.club.updateMany({
    where: { slug: 'clb-lap-trinh-bafu-tech' },
    data: {
      coverUrl: '/images/bafu/students-practical-lab-2025.jpg',
      shortDescription: 'Cộng đồng Tin học (IT BAFU) & Sáng tạo số — Nghiên cứu công nghệ, lập trình web, AI ứng dụng nông nghiệp.'
    }
  });
  console.log('✅ Đã gắn ảnh bìa chính thức cho CLB Lập Trình & Công Nghệ BAFU Tech (students-practical-lab-2025.jpg)');

  // 2. Đối chiếu và tích hợp các CLB thực tế theo tài liệu trường BAFU
  const startUpCat = await prisma.clubCategory.findUnique({ where: { slug: 'ky-nang-khoi-nghiep' } });
  if (startUpCat) {
    const existingStartupClub = await prisma.club.findUnique({ where: { slug: 'clb-khoi-nghiep-bafu' } });
    if (!existingStartupClub) {
      await prisma.club.create({
        data: {
          name: 'CLB Khởi Nghiệp BAFU',
          slug: 'clb-khoi-nghiep-bafu',
          categoryId: startUpCat.id,
          shortDescription: 'Môi trường ươm mầm các ý tưởng đổi mới sáng tạo, chuyển giao khoa học kỹ thuật và khởi nghiệp sinh viên BAFU.',
          description: 'CLB Khởi Nghiệp BAFU ra mắt theo định hướng hỗ trợ sinh viên hiện thực hóa các dự án khởi nghiệp nông nghiệp công nghệ cao, nông nghiệp số và kinh doanh bền vững.',
          meetingSchedule: 'Hàng tháng tại Vườn ươm Khởi nghiệp & Hội trường lớn BAFU',
          email: 'khoinghiep@bafu.edu.vn',
          phone: null,
          status: 'ACTIVE'
        }
      });
      console.log('✅ Đã thêm CLB Khởi Nghiệp BAFU vào danh mục Kỹ năng & Khởi nghiệp');
    }
  }

  const volunteerCat = await prisma.clubCategory.findUnique({ where: { slug: 'tinh-nguyen-cong-dong' } });
  if (volunteerCat) {
    const existingBloodClub = await prisma.club.findUnique({ where: { slug: 'clb-hien-mau-tinh-nguyen' } });
    if (!existingBloodClub) {
      await prisma.club.create({
        data: {
          name: 'CLB Hiến Máu Tình Nguyện BAFU',
          slug: 'clb-hien-mau-tinh-nguyen',
          categoryId: volunteerCat.id,
          shortDescription: 'Tuyên truyền, vận động và phối hợp tổ chức chiến dịch hiến máu nhân đạo "Giọt Hồng BAFU" thường niên.',
          description: 'CLB Hiến Máu Tình Nguyện BAFU là lực lượng xung kích trong công tác hiến máu cứu người, giáo dục lòng nhân ái và tinh thần trách nhiệm vì cộng đồng của sinh viên nhà trường.',
          meetingSchedule: 'Sinh hoạt định kỳ và phối hợp tổ chức các đợt tiếp nhận máu tại sảnh Giảng đường B5',
          email: 'hienmau@bafu.edu.vn',
          phone: null,
          status: 'ACTIVE'
        }
      });
      console.log('✅ Đã thêm CLB Hiến Máu Tình Nguyện BAFU vào danh mục Tình nguyện & Cộng đồng');
    }
  }

  // 3. Xử lý trùng lặp sự kiện tạo bởi các lần chạy vitest cũ
  const aiEvents = await prisma.clubEvent.findMany({
    where: { title: 'Hội Thảo Công Nghệ AI Cho Nông Nghiệp 2026' },
    orderBy: { createdAt: 'asc' }
  });

  if (aiEvents.length > 1) {
    // Giữ lại bản ghi đầu tiên, xóa các bản ghi test phát sinh sau
    const duplicateIds = aiEvents.slice(1).map(e => e.id);
    await prisma.eventRegistration.deleteMany({
      where: { eventId: { in: duplicateIds } }
    });
    await prisma.clubEvent.deleteMany({
      where: { id: { in: duplicateIds } }
    });
    console.log(`✅ Đã làm sạch ${duplicateIds.length} bản ghi sự kiện test trùng lặp, bảo toàn 1 bản ghi sự kiện chính thức.`);
  }

  console.log('🎉 Hoàn tất tích hợp dữ liệu thực tế và dọn dẹp an toàn!');
}

main()
  .catch(e => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
