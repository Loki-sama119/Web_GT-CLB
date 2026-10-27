// Editorial category accents; these are not official club brand identities.
const identities = {
  community: {
    accent: "#216344",
    label: "Vì cộng đồng",
    word: "CHIA SẺ.",
    detail: "Những việc nhỏ, ý nghĩa lớn.",
  },
  blood: {
    accent: "#A33635",
    label: "Hiến máu tình nguyện",
    word: "TRAO ĐI.",
    detail: "Kết nối từ lòng nhân ái.",
  },
  technology: {
    accent: "#315B87",
    label: "Tin học",
    word: "HỌC HỎI.",
    detail: "Cùng tìm hiểu, cùng tiến bộ.",
  },
  enterprise: {
    accent: "#866128",
    label: "Khởi nghiệp",
    word: "KHỞI ĐẦU.",
    detail: "Một ý tưởng, nhiều kết nối.",
  },
  "performing-arts": {
    accent: "#754C72",
    label: "Văn nghệ",
    word: "THỂ HIỆN.",
    detail: "Một không gian cho cảm hứng.",
  },
};
export const clubIdentity = (club) =>
  identities[club?.identityKey] || {
    accent: "#575E5B",
    label: club?.category?.name || "Câu lạc bộ",
    word: "KẾT NỐI.",
    detail: "Khám phá cộng đồng sinh viên.",
  };
export const activityLabel = (club) =>
  club.activityStatus === "CONFIRMED_ACTIVE"
    ? "Đã xác nhận hoạt động"
    : "Hoạt động hiện tại: đang cập nhật";
