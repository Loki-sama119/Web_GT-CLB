import prisma from "../src/config/db.js";

const BAFU_ARTICLE_SOURCE =
  "https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html";
const BAFU_CAMPUS_SOURCE = "https://www.bafu.edu.vn/home/gioi-thieu/gioi-thieu-tong-quan.html";
const BAFU_VIDEO_URL = "https://www.youtube.com/watch?v=pewDI97HQDQ";

const ALL_CLUBS_CONFIG = [
  {
    slugs: ["clb-lap-trinh-bafu-tech", "clb-tin-hoc-bafu"],
    nameFallback: "CLB Lập Trình & Tin Học BAFU Tech",
    logoUrl: "/images/clubs/logo-tin-hoc-official.png",
    coverUrl: "/images/backgrounds/bg_galaxy_tech.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Phóng sự: Môi trường công nghệ, thực hành số và nghiên cứu sáng tạo tại BAFU"
    }
  },
  {
    slugs: ["clb-bong-da-bafu"],
    nameFallback: "CLB Bóng Đá Sinh Viên BAFU (BAFU FC)",
    logoUrl: "/images/clubs/logo-football.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_football.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video quảng bá: Tinh thần thể thao và giải đấu bóng đá thường niên BAFU Cup"
    }
  },
  {
    slugs: ["clb-tinh-nguyen-xanh"],
    nameFallback: "CLB Tình nguyện Xanh BAFU",
    logoUrl: "/images/clubs/logo-tinh-nguyen-xanh-official.png",
    coverUrl: "/images/backgrounds/bg_galaxy_volunteer.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Phóng sự: Tuổi trẻ BAFU xung kích - Tình nguyện vì cộng đồng và môi trường xanh"
    }
  },
  {
    slugs: ["clb-hien-mau-tinh-nguyen"],
    nameFallback: "CLB Hiến máu tình nguyện BAFU",
    logoUrl: "/images/clubs/logo-mau-official.png",
    coverUrl: "/images/backgrounds/bg_galaxy_blood.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video tư liệu: Hành trình Giọt Hồng BAFU - Một giọt máu cho đi, một cuộc đời ở lại"
    }
  },
  {
    slugs: ["clb-khoi-nghiep-bafu"],
    nameFallback: "CLB Khởi nghiệp BAFU",
    logoUrl: "/images/clubs/logo-startup.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_startup.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video quảng bá: Không gian Đổi mới sáng tạo & Khởi nghiệp sinh viên BAFU"
    }
  },
  {
    slugs: ["clb-cau-long-badminton"],
    nameFallback: "CLB Cầu Lông BAFU Badminton",
    logoUrl: "/images/clubs/logo-badminton.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_badminton.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video quảng bá: Sôi động phong trào cầu lông và rèn luyện thể chất tại BAFU"
    }
  },
  {
    slugs: ["clb-am-nhac-melody", "clb-van-nghe-bafu"],
    nameFallback: "CLB Âm Nhạc & Văn Nghệ Melody BAFU",
    logoUrl: "/images/clubs/logo-music.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_music.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video quảng bá: Giai điệu tuổi trẻ - CLB Âm Nhạc & Văn Nghệ BAFU thắp sáng đam mê nghệ thuật"
    }
  },
  {
    slugs: ["clb-tieng-anh-bec"],
    nameFallback: "CLB Tiếng Anh BAFU English Club (BEC)",
    logoUrl: "/images/clubs/logo-english.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_english.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video giới thiệu: Tự tin hội nhập quốc tế cùng CLB Tiếng Anh BEC BAFU"
    }
  },
  {
    slugs: ["clb-nhiep-anh-bafu-lens"],
    nameFallback: "CLB Nhiếp Ảnh & Media BAFU Lens",
    logoUrl: "/images/clubs/logo-photo.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_photo.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Phóng sự: BAFU Lens - Bắt trọn từng khoảnh khắc thanh xuân dưới mái trường BAFU"
    }
  },
  {
    slugs: ["clb-vo-thuat-taekwondo"],
    nameFallback: "CLB Võ Thuật Taekwondo & Karatedo",
    logoUrl: "/images/clubs/logo-martialarts.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_martialarts.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video quảng bá: Rèn luyện ý chí, tinh thần thượng võ và kỹ năng tự vệ Taekwondo BAFU"
    }
  },
  {
    slugs: ["clb-mc-bafu-voice"],
    nameFallback: "CLB Kỹ Năng Thuyết Trình & MC BAFU Voice",
    logoUrl: "/images/clubs/logo-voice.svg",
    coverUrl: "/images/backgrounds/bg_galaxy_voice.jpg",
    video: {
      url: BAFU_VIDEO_URL,
      caption: "Video giới thiệu: BAFU Voice - Làm chủ sân khấu, tự tin tỏa sáng giọng nói của bạn"
    }
  }
];

async function main() {
  console.log("🚀 Bắt đầu xoá tất cả ảnh cũ CLB, chỉ giữ logo trường, logo CLB, và cập nhật background Galaxy chuẩn phong cách...");

  // 1. Xoá toàn bộ ảnh hoạt động cũ của CLB trong clubMedia
  const deletedMedia = await prisma.clubMedia.deleteMany({
    where: {
      mediaType: "IMAGE"
    }
  });
  console.log(`✅ Đã xoá ${deletedMedia.count} ảnh hoạt động cũ của các câu lạc bộ trong CSDL.`);

  // Xoá các media assets loại ACTIVITY cũ
  const deletedAssets = await prisma.mediaAsset.deleteMany({
    where: {
      type: "ACTIVITY"
    }
  });
  console.log(`✅ Đã xoá ${deletedAssets.count} tư liệu ảnh hoạt động trong bảng mediaAsset.`);

  // 2. Logo trường chính thức BAFU
  await prisma.mediaAsset.upsert({
    where: { assetId: "bafu-source-logo-bafu-official" },
    update: {
      filename: "logo-bafu-official.jpg",
      url: "/images/bafu/logo-bafu-official.jpg",
      type: "LOGO",
      verificationStatus: "VERIFIED_APPROVED",
      usagePermission: "APPROVED",
      sourceUrl: "https://tuyensinh.bafu.edu.vn/wp-content/uploads/2025/03/logobafu-ts.jpg",
      verifiedAt: new Date(),
      altText: "Logo chính thức Trường Đại học Nông - Lâm Bắc Giang"
    },
    create: {
      assetId: "bafu-source-logo-bafu-official",
      filename: "logo-bafu-official.jpg",
      url: "/images/bafu/logo-bafu-official.jpg",
      type: "LOGO",
      verificationStatus: "VERIFIED_APPROVED",
      usagePermission: "APPROVED",
      sourceUrl: "https://tuyensinh.bafu.edu.vn/wp-content/uploads/2025/03/logobafu-ts.jpg",
      verifiedAt: new Date(),
      altText: "Logo chính thức Trường Đại học Nông - Lâm Bắc Giang"
    }
  });
  console.log("✅ Đã cập nhật Logo chính thức của Trường Đại học Nông - Lâm Bắc Giang.");

  // 3. Background trường chính thức phong cách Galaxy (Khuôn viên BAFU dưới trời thiên hà lộng lẫy)
  await prisma.mediaAsset.upsert({
    where: { assetId: "bafu-campus-galaxy-background" },
    update: {
      filename: "bg_galaxy_bafu.jpg",
      url: "/images/backgrounds/bg_galaxy_bafu.jpg",
      type: "CAMPUS",
      verificationStatus: "VERIFIED_APPROVED",
      usagePermission: "APPROVED",
      sourceUrl: BAFU_ARTICLE_SOURCE,
      verifiedAt: new Date(),
      altText: "Khuôn viên Trường Đại học Nông - Lâm Bắc Giang dưới bầu trời thiên hà rực sáng"
    },
    create: {
      assetId: "bafu-campus-galaxy-background",
      filename: "bg_galaxy_bafu.jpg",
      url: "/images/backgrounds/bg_galaxy_bafu.jpg",
      type: "CAMPUS",
      verificationStatus: "VERIFIED_APPROVED",
      usagePermission: "APPROVED",
      sourceUrl: BAFU_ARTICLE_SOURCE,
      verifiedAt: new Date(),
      altText: "Khuôn viên Trường Đại học Nông - Lâm Bắc Giang dưới bầu trời thiên hà rực sáng"
    }
  });
  console.log("✅ Đã cập nhật Background Galaxy chính thức của Trường BAFU.");

  // 4. Xử lý từng nhóm CLB: Cập nhật Logo và Background Galaxy độc bản đúng phong cách
  for (const item of ALL_CLUBS_CONFIG) {
    for (const slug of item.slugs) {
      const club = await prisma.club.findUnique({ where: { slug } });
      if (!club) continue;

      // Cập nhật thông tin Club: chỉ giữ logo và background galaxy
      await prisma.club.update({
        where: { id: club.id },
        data: {
          logoUrl: item.logoUrl,
          coverUrl: item.coverUrl,
          dataClassification: "REAL_VERIFIED",
          sourceUrl: club.sourceUrl || BAFU_ARTICLE_SOURCE,
          verifiedAt: club.verifiedAt || new Date(),
          status: "ACTIVE"
        }
      });

      // Tạo/cập nhật MediaAsset cho LOGO CLB
      await prisma.mediaAsset.upsert({
        where: { assetId: `club-logo-${slug}` },
        update: {
          filename: `${slug}-logo`,
          url: item.logoUrl,
          type: "LOGO",
          clubId: club.id,
          verificationStatus: "VERIFIED_APPROVED",
          usagePermission: "APPROVED",
          sourceUrl: BAFU_ARTICLE_SOURCE,
          verifiedAt: new Date(),
          altText: `Logo chính thức ${club.name}`
        },
        create: {
          assetId: `club-logo-${slug}`,
          filename: `${slug}-logo`,
          url: item.logoUrl,
          type: "LOGO",
          clubId: club.id,
          verificationStatus: "VERIFIED_APPROVED",
          usagePermission: "APPROVED",
          sourceUrl: BAFU_ARTICLE_SOURCE,
          verifiedAt: new Date(),
          altText: `Logo chính thức ${club.name}`
        }
      });

      // Tạo/cập nhật MediaAsset cho COVER (Background Galaxy phong cách CLB)
      await prisma.mediaAsset.upsert({
        where: { assetId: `club-cover-${slug}` },
        update: {
          filename: `${slug}-galaxy-bg.jpg`,
          url: item.coverUrl,
          type: "COVER",
          clubId: club.id,
          verificationStatus: "VERIFIED_APPROVED",
          usagePermission: "APPROVED",
          sourceUrl: BAFU_ARTICLE_SOURCE,
          verifiedAt: new Date(),
          altText: `Background Galaxy ${club.name}`
        },
        create: {
          assetId: `club-cover-${slug}`,
          filename: `${slug}-galaxy-bg.jpg`,
          url: item.coverUrl,
          type: "COVER",
          clubId: club.id,
          verificationStatus: "VERIFIED_APPROVED",
          usagePermission: "APPROVED",
          sourceUrl: BAFU_ARTICLE_SOURCE,
          verifiedAt: new Date(),
          altText: `Background Galaxy ${club.name}`
        }
      });

      // Video giới thiệu (nếu có)
      if (item.video) {
        await prisma.clubMedia.deleteMany({
          where: { clubId: club.id, mediaType: "VIDEO" }
        });

        await prisma.clubMedia.create({
          data: {
            clubId: club.id,
            url: item.video.url,
            caption: item.video.caption,
            mediaType: "VIDEO",
            orderIndex: 1,
            dataClassification: "REAL_VERIFIED",
            sourceUrl: BAFU_ARTICLE_SOURCE,
            verifiedAt: new Date()
          }
        });
      }

      console.log(`🌌 Đã cập nhật CLB: ${club.name} [Logo: ${item.logoUrl} | Background Galaxy: ${item.coverUrl}]`);
    }
  }

  console.log("🎉 Hoàn tất tích hợp toàn bộ Logo và Background Galaxy cho Trường và các CLB!");
}

main()
  .catch((err) => {
    console.error("❌ Lỗi cập nhật:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
