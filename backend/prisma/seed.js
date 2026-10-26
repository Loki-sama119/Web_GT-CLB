import { PrismaClient, SystemRole, ClubRole, ClubStatus, CampaignStatus, QuestionType, ApplicationStatus, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu Seed cho University Club Portal...');

  // Xóa sạch dữ liệu cũ theo thứ tự quan hệ an toàn
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.clubEvent.deleteMany();
  await prisma.clubPost.deleteMany();
  await prisma.applicationAnswer.deleteMany();
  await prisma.application.deleteMany();
  await prisma.formQuestion.deleteMany();
  await prisma.applicationForm.deleteMany();
  await prisma.recruitmentCampaign.deleteMany();
  await prisma.clubMembership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.clubCategory.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('12345678', 10);
  const adminPassword = await bcrypt.hash('AdminPassword@2026', 10);

  // 1. Tạo Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@bafu.edu.vn',
      passwordHash: adminPassword,
      role: SystemRole.SUPER_ADMIN,
      studentProfile: {
        create: {
          fullName: 'Ban Giám Hiệu & Quản Trị Hệ Thống BAFU',
          studentCode: 'ADMIN-001',
          faculty: 'Phòng Công Tác Sinh Viên & Đoàn Thanh Niên',
          phone: '02043874112',
          bio: 'Quản trị viên cổng thông tin các câu lạc bộ Trường Đại học Nông - Lâm Bắc Giang.'
        }
      }
    }
  });
  console.log('✅ Đã tạo Super Admin: admin@bafu.edu.vn / AdminPassword@2026');

  // 2. Tạo Danh mục CLB
  const categoriesData = [
    { name: 'Thể dục Thể thao', slug: 'the-thao', icon: 'Trophy', description: 'Rèn luyện thể chất, nâng cao tinh thần đồng đội và thi đấu giao hữu.' },
    { name: 'Học thuật & Công nghệ', slug: 'hoc-thuat-cong-nghe', icon: 'Code', description: 'Nghiên cứu khoa học, lập trình phần mềm, ngoại ngữ và kỹ năng số.' },
    { name: 'Nghệ thuật & Văn hóa', slug: 'nghe-thuat-van-hoa', icon: 'Music', description: 'Âm nhạc, nhảy hiện đại, nhiếp ảnh, hội họa và giao lưu văn hóa.' },
    { name: 'Tình nguyện & Cộng đồng', slug: 'tinh-nguyen-cong-dong', icon: 'HeartHandshake', description: 'Các chiến dịch mùa hè xanh, tiếp sức mùa thi và hoạt động thiện nguyện.' },
    { name: 'Kỹ năng & Khởi nghiệp', slug: 'ky-nang-khoi-nghiep', icon: 'Lightbulb', description: 'Phát triển kỹ năng mềm, thuyết trình, tư duy lãnh đạo và khởi nghiệp sinh viên.' }
  ];

  const categories = {};
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = await prisma.clubCategory.create({
      data: { ...categoriesData[i], displayOrder: i + 1 }
    });
    categories[cat.slug] = cat;
  }
  console.log('✅ Đã tạo 5 danh mục lĩnh vực CLB');

  // 3. Tạo tài khoản BCN Club Admin
  const adminUsers = [];
  const clubAdminConfigs = [
    { email: 'bongda.leader@bafu.edu.vn', name: 'Nguyễn Văn Hùng', code: 'SV2022001', faculty: 'Khoa Cơ Điện' },
    { email: 'caulong.leader@bafu.edu.vn', name: 'Trần Thị Mai', code: 'SV2022002', faculty: 'Khoa Kinh tế - QTKD' },
    { email: 'it.leader@bafu.edu.vn', name: 'Lê Hoàng Nam', code: 'SV2022003', faculty: 'Khoa Công nghệ Thông tin' },
    { email: 'guitar.leader@bafu.edu.vn', name: 'Phạm Minh Tuấn', code: 'SV2022004', faculty: 'Khoa Nông học' },
    { email: 'english.leader@bafu.edu.vn', name: 'Đỗ Thảo Vy', code: 'SV2022005', faculty: 'Khoa Ngoại ngữ' },
    { email: 'tinhnguyen.leader@bafu.edu.vn', name: 'Vũ Quốc Bảo', code: 'SV2022006', faculty: 'Khoa Tài nguyên Môi trường' },
    { email: 'bongro.leader@bafu.edu.vn', name: 'Bùi Đức Anh', code: 'SV2022007', faculty: 'Khoa Chăn nuôi Thú y' },
    { email: 'nhiepanh.leader@bafu.edu.vn', name: 'Hoàng Yến Nhi', code: 'SV2022008', faculty: 'Khoa Lâm nghiệp' },
    { email: 'vothuat.leader@bafu.edu.vn', name: 'Dương Tấn Đạt', code: 'SV2022009', faculty: 'Khoa Cơ Điện' },
    { email: 'truyenthong.leader@bafu.edu.vn', name: 'Lê Quỳnh Nga', code: 'SV2022010', faculty: 'Khoa Kinh tế - QTKD' }
  ];

  for (const cfg of clubAdminConfigs) {
    const user = await prisma.user.create({
      data: {
        email: cfg.email,
        passwordHash: defaultPassword,
        role: SystemRole.STUDENT,
        studentProfile: {
          create: {
            fullName: cfg.name,
            studentCode: cfg.code,
            faculty: cfg.faculty,
            phone: '0988776655',
            academicYear: 'K48'
          }
        }
      }
    });
    adminUsers.push(user);
  }

  // 4. Tạo 10 Câu lạc bộ tiêu biểu
  const clubsData = [
    {
      name: 'CLB Bóng Đá Sinh Viên BAFU (BAFU FC)',
      slug: 'clb-bong-da-bafu',
      categorySlug: 'the-thao',
      shortDescription: 'Nơi quy tụ những đôi chân đam mê trái bóng tròn của sinh viên toàn trường.',
      description: 'CLB Bóng Đá Sinh Viên BAFU được thành lập nhằm tạo sân chơi rèn luyện sức khỏe, tinh thần thể thao cao thượng và kết nối sinh viên qua các giải đấu thường niên cấp khoa và cấp trường.',
      meetingSchedule: 'Chiều thứ Ba và thứ Bảy hàng tuần (16:30 - 18:30 tại Sân cỏ nhân tạo trường).',
      email: 'fc@bafu.edu.vn',
      phone: '0981122334',
      adminUserIndex: 0
    },
    {
      name: 'CLB Cầu Lông BAFU Badminton',
      slug: 'clb-cau-long-badminton',
      categorySlug: 'the-thao',
      shortDescription: 'Giao lưu kỹ thuật cầu lông, thi đấu đôi nam nữ và rèn luyện phản xạ dẻo dai.',
      description: 'CLB Cầu Lông dành cho tất cả các bạn sinh viên từ cơ bản đến nâng cao. CLB sở hữu các buổi tập chuyên nghiệp, có hướng dẫn luật thi đấu và kỹ năng đập cầu, bỏ nhỏ.',
      meetingSchedule: 'Sáng Chủ Nhật (8:00 - 10:30 tại Nhà thi đấu đa năng).',
      email: 'badminton@bafu.edu.vn',
      phone: '0981122335',
      adminUserIndex: 1
    },
    {
      name: 'CLB Lập Trình & Công Nghệ BAFU Tech',
      slug: 'clb-lap-trinh-bafu-tech',
      categorySlug: 'hoc-thuat-cong-nghe',
      shortDescription: 'Cộng đồng sinh viên đam mê Code, Web Development, AI và Sáng tạo số.',
      description: 'BAFU Tech tổ chức các workshop chia sẻ kiến thức lập trình thực chiến, hỗ trợ làm đồ án môn học, tham gia các kỳ thi Hackathon và nghiên cứu khoa học sinh viên.',
      meetingSchedule: 'Tối thứ Tư (19:30 - 21:30 Online / Phòng Lab 302).',
      email: 'tech@bafu.edu.vn',
      phone: '0981122336',
      adminUserIndex: 2
    },
    {
      name: 'CLB Âm Nhạc & Guitar Melody',
      slug: 'clb-am-nhac-melody',
      categorySlug: 'nghe-thuat-van-hoa',
      shortDescription: 'Hòa nhịp cảm xúc, học đàn Guitar, Cajon và biểu diễn acoustic sân trường.',
      description: 'Melody Club là ngôi nhà chung cho những tâm hồn yêu âm nhạc. CLB thường xuyên tổ chức đêm nhạc Acoustic Night tại sảnh hội trường, giao lưu âm nhạc sinh viên.',
      meetingSchedule: 'Chiều thứ Năm (17:00 - 19:00 tại Phòng Âm nhạc Nhà VHL).',
      email: 'melody@bafu.edu.vn',
      phone: '0981122337',
      adminUserIndex: 3
    },
    {
      name: 'CLB Tiếng Anh BAFU English Club (BEC)',
      slug: 'clb-tieng-anh-bec',
      categorySlug: 'hoc-thuat-cong-nghe',
      shortDescription: 'Môi trường luyện nói tiếng Anh tự tin, giao tiếp với giảng viên nước ngoài.',
      description: 'Tự tin giao tiếp tiếng Anh qua các chủ đề thú vị, trò chơi tương tác, luyện phát âm chuẩn IPA và ôn luyện chứng chỉ TOEIC, IELTS cần thiết cho chuẩn đầu ra tốt nghiệp.',
      meetingSchedule: 'Sáng thứ Bảy (9:00 - 11:00 tại Hội trường B).',
      email: 'bec@bafu.edu.vn',
      phone: '0981122338',
      adminUserIndex: 4
    },
    {
      name: 'CLB Tình Nguyện Xanh Sinh Viên BAFU',
      slug: 'clb-tinh-nguyen-xanh',
      categorySlug: 'tinh-nguyen-cong-dong',
      shortDescription: 'Lan tỏa yêu thương, hiến máu nhân đạo và chiến dịch mùa hè xanh ý nghĩa.',
      description: 'Là một trong những CLB có bề dày truyền thống nhất trường, chuyên tổ chức Ngày hội hiến máu Giọt Hồng Nông Lâm, hỗ trợ các gia đình chính sách và bảo vệ môi trường giảng đường.',
      meetingSchedule: 'Chủ Nhật tuần đầu tiên mỗi tháng (8:00 - 11:00).',
      email: 'tinhnguyen@bafu.edu.vn',
      phone: '0981122339',
      adminUserIndex: 5
    },
    {
      name: 'CLB Bóng Rổ BAFU Hoops',
      slug: 'clb-bong-ro-bafu-hoops',
      categorySlug: 'the-thao',
      shortDescription: 'Sôi động cùng những pha ném 3 điểm, dẫn bóng điệu nghệ và thể lực đỉnh cao.',
      description: 'CLB quy tụ các bạn sinh viên có niềm đam mê với bóng rổ phong cách đường phố và thi đấu bán chuyên. CLB thường xuyên có các trận đấu giao hữu với các trường đại học lân cận.',
      meetingSchedule: 'Chiều thứ Hai, Tư, Sáu (17:00 - 19:00 tại Sân bóng rổ ngoài trời).',
      email: 'hoops@bafu.edu.vn',
      phone: '0981122340',
      adminUserIndex: 6
    },
    {
      name: 'CLB Nhiếp Ảnh & Media BAFU Lens',
      slug: 'clb-nhiep-anh-bafu-lens',
      categorySlug: 'nghe-thuat-van-hoa',
      shortDescription: 'Lưu giữ từng khoảnh khắc thanh xuân trường đại học qua ống kính máy ảnh.',
      description: 'Học cách chụp ảnh chân dung, phong cảnh sự kiện trường, kỹ năng chỉnh sửa ảnh Lightroom, Photoshop và quay dựng video TikTok, phóng sự sự kiện.',
      meetingSchedule: 'Chiều Chủ Nhật (14:30 - 17:00).',
      email: 'lens@bafu.edu.vn',
      phone: '0981122341',
      adminUserIndex: 7
    },
    {
      name: 'CLB Võ Thuật Taekwondo & Karatedo',
      slug: 'clb-vo-thuat-taekwondo',
      categorySlug: 'the-thao',
      shortDescription: 'Rèn luyện bản lĩnh võ đạo, kỹ năng tự vệ và kỷ luật thép cho sinh viên.',
      description: 'Được dẫn dắt bởi các HLV đai đen uy tín, CLB trang bị cho sinh viên kỹ năng tự vệ trong cuộc sống, nâng cao thể lực và ý chí kiên định.',
      meetingSchedule: 'Tối thứ Ba và Năm (18:30 - 20:30 tại Sảnh Nhà thi đấu).',
      email: 'martialarts@bafu.edu.vn',
      phone: '0981122342',
      adminUserIndex: 8
    },
    {
      name: 'CLB Kỹ Năng Thuyết Trình & MC BAFU Voice',
      slug: 'clb-mc-bafu-voice',
      categorySlug: 'ky-nang-khoi-nghiep',
      shortDescription: 'Làm chủ giọng nói, tự tin thuyết trình trước đám đông và dẫn chương trình sự kiện.',
      description: 'Giúp sinh viên xóa bỏ rào cản sợ nói trước đám đông, học cách kiểm soát ngôn ngữ cơ thể, phát âm tròn vành rõ chữ và rèn luyện kỹ năng điều phối sự kiện chuyên nghiệp.',
      meetingSchedule: 'Tối thứ Sáu (19:00 - 21:00 tại Phòng Hội thảo 1).',
      email: 'voice@bafu.edu.vn',
      phone: '0981122343',
      adminUserIndex: 9
    }
  ];

  const createdClubs = [];
  for (const c of clubsData) {
    const club = await prisma.club.create({
      data: {
        name: c.name,
        slug: c.slug,
        shortDescription: c.shortDescription,
        description: c.description,
        categoryId: categories[c.categorySlug].id,
        meetingSchedule: c.meetingSchedule,
        email: c.email,
        phone: c.phone,
        status: ClubStatus.ACTIVE,
        establishedDate: new Date('2020-09-15')
      }
    });

    // Gán Club Admin cho CLB này với role LEADER
    const adminUser = adminUsers[c.adminUserIndex];
    await prisma.clubMembership.create({
      data: {
        userId: adminUser.id,
        clubId: club.id,
        role: ClubRole.LEADER
      }
    });

    createdClubs.push(club);
  }
  console.log('✅ Đã tạo 10 CLB kèm ban chủ nhiệm quản trị viên');

  // 5. Tạo các Sinh viên mẫu (Students)
  const students = [];
  const studentNames = [
    { name: 'Nguyễn Hải Đăng', code: 'SV2023001', faculty: 'Khoa Công nghệ Thông tin', email: 'haidang.sv@bafu.edu.vn' },
    { name: 'Trần Minh Thư', code: 'SV2023002', faculty: 'Khoa Kinh tế - QTKD', email: 'minhthu.sv@bafu.edu.vn' },
    { name: 'Lê Quang Huy', code: 'SV2023003', faculty: 'Khoa Cơ Điện', email: 'quanghuy.sv@bafu.edu.vn' },
    { name: 'Phạm Thu Trang', code: 'SV2023004', faculty: 'Khoa Ngoại ngữ', email: 'thutrang.sv@bafu.edu.vn' }
  ];

  for (const st of studentNames) {
    const user = await prisma.user.create({
      data: {
        email: st.email,
        passwordHash: defaultPassword,
        role: SystemRole.STUDENT,
        studentProfile: {
          create: {
            fullName: st.name,
            studentCode: st.code,
            faculty: st.faculty,
            phone: '0912345678',
            academicYear: 'K49',
            bio: 'Sinh viên năng động, thích tham gia các hoạt động phong trào và trải nghiệm kỹ năng mới.'
          }
        }
      }
    });
    students.push(user);
  }
  console.log('✅ Đã tạo 4 tài khoản sinh viên mẫu');

  // 6. Tạo Chiến dịch tuyển thành viên & Form câu hỏi động
  // Tạo chiến dịch OPEN cho CLB Lập Trình (BAFU Tech)
  const techClub = createdClubs[2];
  const campaignTech = await prisma.recruitmentCampaign.create({
    data: {
      clubId: techClub.id,
      title: 'Đợt Tuyển Thành Viên Gen 5 — BAFU Tech 2026',
      slug: 'tuyen-thanh-vien-gen-5-bafu-tech',
      description: 'Chào đón các tân chiến binh gia nhập gia đình BAFU Tech! Dù bạn chưa biết gì hay đã có nền tảng code, chỉ cần đam mê học hỏi, chúng mình luôn chào đón!',
      requirements: '- Có laptop cá nhân.\n- Tinh thần học hỏi cao, chịu khó tìm tòi.\n- Cam kết tham gia các buổi sinh hoạt định kỳ.',
      targetQuantity: 25,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-11-30'),
      status: CampaignStatus.OPEN,
      form: {
        create: {
          title: 'Đơn Ứng Tuyển Gia Nhập CLB Lập Trình BAFU Tech',
          description: 'Vui lòng hoàn thành trung thực các câu hỏi dưới đây để BCN hiểu rõ hơn về bạn.',
          questions: {
            create: [
              {
                questionText: 'Ban/Lĩnh vực bạn muốn tham gia nhất?',
                questionType: QuestionType.SINGLE_CHOICE,
                options: JSON.stringify(['Ban Lập trình Web/App', 'Ban Trí tuệ Nhân tạo & Data', 'Ban Truyền thông & Sự kiện']),
                isRequired: true,
                orderIndex: 1
              },
              {
                questionText: 'Bạn đã từng học hoặc biết những ngôn ngữ/công nghệ nào?',
                questionType: QuestionType.MULTIPLE_CHOICE,
                options: JSON.stringify(['C / C++', 'Python', 'JavaScript / TypeScript', 'HTML & CSS', 'Chưa biết gì, muốn học từ đầu']),
                isRequired: true,
                orderIndex: 2
              },
              {
                questionText: 'Lý do và mục tiêu lớn nhất của bạn khi ứng tuyển vào BAFU Tech?',
                questionType: QuestionType.LONG_TEXT,
                isRequired: true,
                orderIndex: 3
              },
              {
                questionText: 'Link Facebook / GitHub / Portfolio của bạn (nếu có):',
                questionType: QuestionType.URL,
                isRequired: false,
                orderIndex: 4
              }
            ]
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

  // Tạo chiến dịch OPEN cho CLB Melody Âm Nhạc
  const melodyClub = createdClubs[3];
  await prisma.recruitmentCampaign.create({
    data: {
      clubId: melodyClub.id,
      title: 'Tuyển Giọng Ca & Nhạc Công Mùa Thu 2026',
      slug: 'tuyen-giong-ca-nhac-cong-melody-2026',
      description: 'Tìm kiếm những giọng hát truyền cảm, tay đàn Guitar điêu luyện cho mùa diễn văn nghệ chào đón tân sinh viên!',
      requirements: 'Đam mê ca hát hoặc có khả năng chơi nhạc cụ acoustic.',
      targetQuantity: 15,
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-11-15'),
      status: CampaignStatus.OPEN,
      form: {
        create: {
          title: 'Bản Đăng Ký Thử Giọng & Casting Melody Club',
          description: 'Hãy chia sẻ về sở trường âm nhạc của bạn.',
          questions: {
            create: [
              {
                questionText: 'Vị trí bạn muốn ứng tuyển?',
                questionType: QuestionType.SINGLE_CHOICE,
                options: JSON.stringify(['Vocalist (Hát chính)', 'Guitarist', 'Cajon / Trống', 'Hậu cần & Âm thanh']),
                isRequired: true,
                orderIndex: 1
              },
              {
                questionText: 'Bài hát bạn tự tin thể hiện nhất:',
                questionType: QuestionType.SHORT_TEXT,
                isRequired: true,
                orderIndex: 2
              }
            ]
          }
        }
      }
    }
  });

  // Tạo chiến dịch CLOSED cho CLB Bóng Đá (Đã hoàn thành)
  const fcClub = createdClubs[0];
  await prisma.recruitmentCampaign.create({
    data: {
      clubId: fcClub.id,
      title: 'Tuyển Quân Đội Tuyển Bóng Đá Sinh Viên Đợt 1',
      slug: 'tuyen-quan-fc-dot-1',
      description: 'Đợt tuyển chọn thành viên đội hình 1 tham dự Giải bóng đá sinh viên BAFU Cup.',
      targetQuantity: 20,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-09-01'),
      status: CampaignStatus.CLOSED
    }
  });
  console.log('✅ Đã tạo các đợt tuyển thành viên OPEN và CLOSED kèm form câu hỏi động');

  // 7. Tạo Hồ sơ ứng tuyển mẫu (Applications)
  const techQuestions = campaignTech.form.questions;
  // Hồ sơ 1: SUBMITTED của Nguyễn Hải Đăng
  const app1 = await prisma.application.create({
    data: {
      campaignId: campaignTech.id,
      userId: students[0].id,
      status: ApplicationStatus.SUBMITTED,
      answers: {
        create: [
          {
            questionId: techQuestions[0].id,
            questionTextSnapshot: techQuestions[0].questionText,
            answerValue: 'Ban Lập trình Web/App'
          },
          {
            questionId: techQuestions[1].id,
            questionTextSnapshot: techQuestions[1].questionText,
            answerValue: JSON.stringify(['JavaScript / TypeScript', 'HTML & CSS'])
          },
          {
            questionId: techQuestions[2].id,
            questionTextSnapshot: techQuestions[2].questionText,
            answerValue: 'Em mong muốn được làm các dự án thực tế, học hỏi từ các anh chị khóa trên và kết nối bạn bè cùng ngành.'
          },
          {
            questionId: techQuestions[3].id,
            questionTextSnapshot: techQuestions[3].questionText,
            answerValue: 'https://github.com/haidang'
          }
        ]
      }
    }
  });

  // Hồ sơ 2: ACCEPTED của Trần Minh Thư -> Đã kích hoạt Membership thành viên CLB
  const app2 = await prisma.application.create({
    data: {
      campaignId: campaignTech.id,
      userId: students[1].id,
      status: ApplicationStatus.ACCEPTED,
      internalNotes: 'Ứng viên có kỹ năng thiết kế giao diện tốt, thái độ lễ phép, trả lời phỏng vấn xuất sắc.',
      reviewedAt: new Date(),
      reviewedByUserId: adminUsers[2].id, // Chủ nhiệm BAFU Tech duyệt
      answers: {
        create: [
          {
            questionId: techQuestions[0].id,
            questionTextSnapshot: techQuestions[0].questionText,
            answerValue: 'Ban Truyền thông & Sự kiện'
          },
          {
            questionId: techQuestions[1].id,
            questionTextSnapshot: techQuestions[1].questionText,
            answerValue: JSON.stringify(['Chưa biết gì, muốn học từ đầu'])
          },
          {
            questionId: techQuestions[2].id,
            questionTextSnapshot: techQuestions[2].questionText,
            answerValue: 'Em muốn rèn luyện kỹ năng truyền thông số, tổ chức sự kiện cho các bạn đam mê CNTT.'
          }
        ]
      }
    }
  });

  // Vì app2 đã ACCEPTED, kích hoạt tư cách thành viên ClubMembership cho Trần Minh Thư
  await prisma.clubMembership.create({
    data: {
      userId: students[1].id,
      clubId: techClub.id,
      role: ClubRole.MEMBER,
      status: 'ACTIVE'
    }
  });

  // Hồ sơ 3: UNDER_REVIEW của Lê Quang Huy
  await prisma.application.create({
    data: {
      campaignId: campaignTech.id,
      userId: students[2].id,
      status: ApplicationStatus.UNDER_REVIEW,
      internalNotes: 'Đã hẹn phỏng vấn vòng 2 vào tối thứ 6.',
      answers: {
        create: [
          {
            questionId: techQuestions[0].id,
            questionTextSnapshot: techQuestions[0].questionText,
            answerValue: 'Ban Trí tuệ Nhân tạo & Data'
          },
          {
            questionId: techQuestions[1].id,
            questionTextSnapshot: techQuestions[1].questionText,
            answerValue: JSON.stringify(['Python', 'C / C++'])
          },
          {
            questionId: techQuestions[2].id,
            questionTextSnapshot: techQuestions[2].questionText,
            answerValue: 'Đam mê nghiên cứu các mô hình Machine Learning và tự động hóa trong nông nghiệp.'
          }
        ]
      }
    }
  });
  console.log('✅ Đã tạo hồ sơ ứng tuyển mẫu ở các trạng thái SUBMITTED, UNDER_REVIEW, ACCEPTED');

  // 8. Tạo Sự kiện mẫu (Events)
  await prisma.clubEvent.create({
    data: {
      clubId: techClub.id,
      title: 'Workshop: Khởi Đầu Lập Trình Web Hiện Đại Với React & Node.js',
      slug: 'workshop-react-nodejs-2026',
      description: 'Buổi chia sẻ kiến thức thực chiến từ các cựu sinh viên BAFU đang làm việc tại các công ty công nghệ.',
      location: 'Hội trường B — Trường Đại học Nông - Lâm Bắc Giang',
      startTime: new Date('2026-11-05T08:30:00Z'),
      endTime: new Date('2026-11-05T11:30:00Z'),
      maxParticipants: 100,
      isPublic: true,
      status: EventStatus.UPCOMING
    }
  });

  await prisma.clubEvent.create({
    data: {
      clubId: fcClub.id,
      title: 'Giải Bóng Đá Tứ Hùng Sinh Viên BAFU Cup 2026',
      slug: 'giai-bong-da-tu-hung-2026',
      description: 'Giải đấu giao hữu giữa các khoa Cơ điện, CNTT, Kinh tế và Tài nguyên.',
      location: 'Sân vận động trường ĐH Nông - Lâm Bắc Giang',
      startTime: new Date('2026-11-12T14:00:00Z'),
      endTime: new Date('2026-11-12T18:00:00Z'),
      maxParticipants: 200,
      isPublic: true,
      status: EventStatus.UPCOMING
    }
  });

  // 9. Tạo Bài viết tin tức mẫu (Posts)
  await prisma.clubPost.create({
    data: {
      clubId: techClub.id,
      authorId: adminUsers[2].id,
      title: 'Tổng Kết Hoạt Động Năm Học 2025 - 2026 Của CLB BAFU Tech',
      slug: 'tong-ket-hoat-dong-bafu-tech-2025-2026',
      content: 'Nhìn lại hành trình 1 năm với hơn 10 workshop công nghệ, 3 dự án phần mềm hỗ trợ nhà trường và hơn 50 thành viên tích cực...',
      isPinned: true
    }
  });

  console.log('🎉 Hoàn tất Seed Data toàn bộ hệ thống!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
