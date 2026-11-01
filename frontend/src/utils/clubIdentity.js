// Phân loại danh mục biên tập (Editorial Category Presentation)
// Đảm bảo không gán ảnh vũ trụ (galaxy) hay tự ý tạo nhận diện thương hiệu giả cho CLB.

const identities = {
  community: {
    accent: "#10B981",
    label: "Vì cộng đồng",
    word: "CHIA SẺ.",
    detail: "Hoạt động xung kích và gắn kết xã hội.",
    gradient: "from-[#064E3B] to-[#047857]",
  },
  blood: {
    accent: "#E11D48",
    label: "Hiến máu tình nguyện",
    word: "TRAO ĐI.",
    detail: "Kết nối từ lòng nhân ái và giọt máu hồng.",
    gradient: "from-[#881337] to-[#BE123C]",
  },
  technology: {
    accent: "#0284C7",
    label: "Tin học & Học thuật",
    word: "SÁNG TẠO.",
    detail: "Giao lưu kiến thức tin học và công nghệ.",
    gradient: "from-[#0C4A6E] to-[#0369A1]",
  },
  enterprise: {
    accent: "#D97706",
    label: "Kỹ năng & Khởi nghiệp",
    word: "KHỞI ĐẦU.",
    detail: "Ươm mầm ý tưởng khởi nghiệp sáng tạo.",
    gradient: "from-[#78350F] to-[#B45309]",
  },
  "performing-arts": {
    accent: "#9333EA",
    label: "Văn nghệ & Nghệ thuật",
    word: "TỎA SÁNG.",
    detail: "Không gian âm nhạc, vũ đạo và thanh xuân.",
    gradient: "from-[#581C87] to-[#7E22CE]",
  },
};

export const getClubBackground = (club) => {
  // Chỉ dùng ảnh bìa nếu đã được xác minh chính thức từ database/assets
  if (club?.coverUrl && !club.coverUrl.includes("bg_galaxy_")) {
    return club.coverUrl;
  }
  return null;
};

export const clubIdentity = (club) => {
  const key = club?.identityKey || (club?.category?.slug?.includes("tinh-nguyen") ? "community" : "technology");
  const base = identities[key] || identities.community;
  return {
    ...base,
    bg: getClubBackground(club),
  };
};

export const activityLabel = (club) => {
  if (club?.activityStatus === "CONFIRMED_ACTIVE") {
    return "Đã xác nhận hoạt động";
  }
  return "Hoạt động hiện tại: Đang cập nhật";
};
