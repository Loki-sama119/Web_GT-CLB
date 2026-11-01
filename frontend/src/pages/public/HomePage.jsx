import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  ArrowUpRight,
  CalendarBlank,
  CheckCircle,
  Eye,
  Info,
  MapPin,
  PlayCircle,
  Users,
  X,
  Compass,
} from "@phosphor-icons/react";
import CampusMasthead from "../../components/editorial/CampusMasthead";
import FeatureClubTile from "../../components/editorial/FeatureClubTile";
import EditorialClubCard from "../../components/editorial/EditorialClubCard";
import EventPoster from "../../components/editorial/EventPoster";
import {
  BAFU_DEFAULT_CLUBS,
  BAFU_DEFAULT_EVENTS,
  BAFU_STATS,
} from "../../utils/bafuData";

function SectionHeading({ number, title, note, link, to }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#D8D5CD]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-[#16845A] uppercase tracking-widest px-2 py-0.5 rounded bg-[#16845A]/10 border border-[#16845A]/20">
            MỤC {number}
          </span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#17211C] tracking-tight">
          {title}
        </h2>
        {note && <p className="text-sm sm:text-base text-[#575E5B] max-w-2xl">{note}</p>}
      </div>
      {link && to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F5132] hover:text-[#16845A] transition-colors shrink-0 group"
        >
          <span>{link}</span>
          <ArrowUpRight size={18} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(BAFU_STATS);
  const [clubs, setClubs] = useState(BAFU_DEFAULT_CLUBS);
  const [events, setEvents] = useState(BAFU_DEFAULT_EVENTS);
  const [search, setSearch] = useState("");
  const [activeEventTab, setActiveEventTab] = useState("past"); // 'upcoming' | 'past'
  const [activeLightboxMedia, setActiveLightboxMedia] = useState(null);

  useEffect(() => {
    let current = true;
    (async () => {
      try {
        const [s, c, e] = await Promise.all([
          api.getStatsOverview().catch(() => null),
          api.getClubs({ limit: 12 }).catch(() => null),
          api.getEvents({ limit: 8 }).catch(() => null),
        ]);
        if (current) {
          if (s?.data) setStats(s.data);
          if (c?.data?.clubs?.length) setClubs(c.data.clubs);
          if (e?.data?.events?.length) setEvents(e.data.events);
        }
      } catch (_err) {
        // Fallback truthful BAFU data
      }
    })();
    return () => {
      current = false;
    };
  }, []);

  const upcomingEvents = events.filter(
    (e) => new Date(e.startTime) > new Date() && e.status === "UPCOMING",
  );
  const pastEvents = events.filter(
    (e) => new Date(e.startTime) <= new Date() || e.status === "PAST",
  );

  // Bộ sưu tập tư liệu hoạt động sinh viên BAFU đã xác minh từ bài viết chính thức
  const studentGallery = [
    {
      id: "gal-01",
      src: "/images/bafu/students-welcome-2025.jpg",
      title: "Gala Chào Tân Sinh Viên & Ngày Hội Thanh Xuân",
      scope: "TƯ LIỆU TRƯỜNG • PHONG TRÀO CHUNG",
      caption: "Khoảnh khắc sôi nổi của sinh viên trong đêm hội chào tân sinh viên Trường ĐH Nông – Lâm Bắc Giang.",
      source: "bafu.edu.vn",
      sourceUrl: "https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html",
    },
    {
      id: "gal-02",
      src: "/images/bafu/students-football-2025.jpg",
      title: "Giải Bóng Đá Thường Niên BAFU Cup",
      scope: "TƯ LIỆU THỂ THAO SINH VIÊN BAFU",
      caption: "Hoạt động thi đấu thể thao rèn luyện sức khỏe và tinh thần đồng đội tại sân bóng cỏ nhân tạo BAFU.",
      source: "bafu.edu.vn",
      sourceUrl: "https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html",
    },
    {
      id: "gal-03",
      src: "/images/bafu/students-practical-lab-2025.jpg",
      title: "Nghiên cứu & Thực hành phòng thí nghiệm",
      scope: "TƯ LIỆU HỌC THUẬT & NGHIÊN CỨU",
      caption: "Sinh viên thực hành kỹ thuật chuyên sâu tại phòng thí nghiệm công nghệ sinh học nông - lâm nghiệp.",
      source: "bafu.edu.vn",
      sourceUrl: "https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html",
    },
    {
      id: "gal-04",
      src: "/images/bafu/students-graduation-2025.jpg",
      title: "Lễ Trao Bằng Tốt Nghiệp Cử Nhân & Kỹ Sư",
      scope: "TƯ LIỆU TRƯỜNG • LỄ TỐT NGHIỆP",
      caption: "Niềm vui rạng rỡ của các tân cử nhân, kỹ sư BAFU trong ngày vinh quy nhận bằng tốt nghiệp.",
      source: "bafu.edu.vn",
      sourceUrl: "https://bafu.edu.vn/home/tin-tuc/dao-tao-tuyen-sinh/4428-vi-sao-nen-chon-truong-dai-hoc-nong-lam-bac-giang-chon-dung-truong-vung-tuong-lai.html",
    },
  ];

  return (
    <div className="bg-[#F8FAF7] text-[#17211C] min-h-screen selection:bg-[#16845A] selection:text-white">
      {/* SECTION 02: Full-Width Campus Hero Banner */}
      <CampusMasthead
        searchQuery={search}
        onSearchChange={setSearch}
        onSearchSubmit={(e) => {
          e.preventDefault();
          navigate("/clubs?search=" + encodeURIComponent(search.trim()));
        }}
        stats={stats}
      />

      {/* SECTION 03: Khám phá những cộng đồng sinh viên (Visual Grid) */}
      <section id="kham-pha" className="py-20 lg:py-24 border-b border-[#D8D5CD]/60">
        <div className="editorial-container">
          <SectionHeading
            number="01"
            title="Những cộng đồng sinh viên BAFU"
            note="Các câu lạc bộ có hồ sơ tư liệu được ghi nhận trong các kênh thông tin chính thức của Trường Đại học Nông – Lâm Bắc Giang."
            link="Xem tất cả câu lạc bộ"
            to="/clubs"
          />

          {clubs.length > 0 ? (
            <div className="space-y-8">
              {/* Top 2 featured visual tiles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {clubs.slice(0, 2).map((c, i) => (
                  <FeatureClubTile key={c.id || c.slug} club={c} index={i + 1} />
                ))}
              </div>

              {/* Next clubs in 3-column visual grid */}
              {clubs.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
                  {clubs.slice(2).map((c) => (
                    <EditorialClubCard key={c.id || c.slug} club={c} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[#D8D5CD] p-12 text-center rounded-xl space-y-3">
              <p className="text-base text-[#575E5B]">
                Danh mục câu lạc bộ đang được cập nhật từ các nguồn xác minh.
              </p>
              <Link to="/clubs" className="text-sm font-bold text-[#0F5132] hover:underline">
                Tra cứu danh bạ câu lạc bộ ↗
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 04: Hoạt động sinh viên BAFU (Asymmetric Editorial Gallery) */}
      <section id="hoat-dong" className="py-20 lg:py-24 bg-[#FAF9F5] border-b border-[#D8D5CD]/60">
        <div className="editorial-container">
          <SectionHeading
            number="02"
            title="Khoảnh khắc & Hoạt động sinh viên BAFU"
            note="Tư liệu ghi nhận các phong trào học tập, văn nghệ, thể thao và gắn kết thanh xuân tại Trường ĐH Nông – Lâm Bắc Giang."
            link="Tìm hiểu đời sống sinh viên"
            to="/events"
          />

          {/* Asymmetric Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Main Featured Photo (7 cols) */}
            <div
              onClick={() => setActiveLightboxMedia(studentGallery[0])}
              className="lg:col-span-7 group relative overflow-hidden rounded-2xl bg-[#17211C] shadow-lg border border-[#D8D5CD] cursor-pointer min-h-[380px] sm:min-h-[460px] flex flex-col justify-end"
            >
              <img
                src={studentGallery[0].src}
                alt={studentGallery[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17211C]/90 via-[#17211C]/35 to-transparent pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 space-y-2 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded bg-[#16845A] text-white">
                    {studentGallery[0].scope}
                  </span>
                  <span className="text-xs text-white/80 flex items-center gap-1 font-semibold group-hover:text-[#E7B85B] transition-colors">
                    <Eye size={16} />
                    <span>Xem ảnh lớn</span>
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
                  {studentGallery[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E2E8F0] line-clamp-2">
                  {studentGallery[0].caption}
                </p>
                <div className="pt-2 text-[11px] text-[#A7F3D0] flex items-center gap-1 font-medium">
                  <CheckCircle size={13} weight="fill" />
                  <span>Nguồn tư liệu: {studentGallery[0].source}</span>
                </div>
              </div>
            </div>

            {/* Secondary 3 stacked photos (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {studentGallery.slice(1).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxMedia(item)}
                  className="group relative overflow-hidden rounded-xl bg-[#17211C] shadow-sm border border-[#D8D5CD] cursor-pointer h-48 sm:h-52 flex flex-col justify-end"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17211C]/90 via-[#17211C]/40 to-transparent pointer-events-none" />

                  <div className="relative z-10 p-4 space-y-1 text-white">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E7B85B]">
                      {item.scope}
                    </span>
                    <h4 className="font-display font-bold text-base leading-snug group-hover:text-[#E7B85B] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-white/80 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: Video và khoảnh khắc sinh viên */}
      <section className="py-20 lg:py-24 border-b border-[#D8D5CD]/60 bg-white">
        <div className="editorial-container">
          <SectionHeading
            number="03"
            title="Phóng sự & Video tư liệu trường"
            note="Tìm hiểu khuôn viên xanh sinh thái và môi trường đào tạo tại Trường Đại học Nông – Lâm Bắc Giang qua phóng sự truyền hình thực tế."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* 16:9 Responsive Video Player */}
            <div className="lg:col-span-8">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black border border-[#D8D5CD]">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/pewDI97HQDQ?rel=0&modestbranding=1"
                  title="Phóng sự: Khuôn viên Trường Đại học Nông – Lâm Bắc Giang"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 text-xs text-[#575E5B]">
                <span className="font-semibold text-[#17211C]">
                  Phóng sự Khuôn viên Trường Đại học Nông – Lâm Bắc Giang (BAFU)
                </span>
                <span className="text-[#16845A] font-bold">
                  Kênh chính thức: @dhnlbg ↗
                </span>
              </div>
            </div>

            {/* Video Companion Highlights */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border-l-3 border-[#0F5132] pl-4 space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0F5132]">
                  MÔI TRƯỜNG BAFU
                </span>
                <h3 className="font-display font-bold text-xl text-[#17211C]">
                  Không gian học tập xanh & thân thiện
                </h3>
                <p className="text-sm text-[#575E5B] leading-relaxed">
                  Khuôn viên trường rộng lớn tại Bích Động, Việt Yên, Bắc Giang với hệ sinh thái hồ nước, đồi cây và đảo cò thanh bình.
                </p>
              </div>

              <div className="bg-[#F8FAF7] border border-[#D8D5CD] p-5 rounded-xl space-y-3 text-xs text-[#575E5B]">
                <div className="flex items-center gap-2 font-bold text-[#17211C]">
                  <MapPin size={18} className="text-[#0F5132]" />
                  <span>Cơ sở vật chất sinh viên</span>
                </div>
                <ul className="space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16845A] mt-1.5 shrink-0" />
                    <span>Hội trường lớn A1 & khu vực sân khấu biểu diễn thanh niên.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16845A] mt-1.5 shrink-0" />
                    <span>Sân vận động, sân cỏ nhân tạo & nhà thi đấu đa năng.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16845A] mt-1.5 shrink-0" />
                    <span>Phòng thực hành máy tính & không gian nghiên cứu sinh viên.</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://www.youtube.com/@dhnlbg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] hover:text-[#16845A] transition-colors"
              >
                <PlayCircle size={18} weight="bold" />
                <span>Xem thêm trên kênh YouTube BAFU (@dhnlbg) ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06: Tin tức và sự kiện (Tách rõ Lịch mới & Tư liệu lịch sử) */}
      <section className="py-20 lg:py-24 border-b border-[#D8D5CD]/60 bg-[#FAF9F5]">
        <div className="editorial-container">
          <SectionHeading
            number="04"
            title="Tin tức & Sự kiện hoạt động"
            note="Phân định minh bạch giữa các sự kiện sắp diễn ra và tư liệu các hoạt động đã diễn ra trong lịch sử trường."
            link="Xem tất cả sự kiện"
            to="/events"
          />

          {/* Tab Selector */}
          <div className="flex items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setActiveEventTab("past")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeEventTab === "past"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "bg-white text-[#575E5B] border border-[#D8D5CD] hover:border-[#0F5132]"
              }`}
            >
              Tư liệu hoạt động đã diễn ra ({pastEvents.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveEventTab("upcoming")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeEventTab === "upcoming"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "bg-white text-[#575E5B] border border-[#D8D5CD] hover:border-[#0F5132]"
              }`}
            >
              Lịch sự kiện sắp tới ({upcomingEvents.length})
            </button>
          </div>

          {activeEventTab === "past" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {pastEvents.map((e) => (
                <div
                  key={e.id}
                  className="bg-white border border-[#D8D5CD] hover:border-[#16845A] rounded-xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E7B85B] uppercase tracking-wider bg-[#E7B85B]/10 px-2.5 py-0.5 rounded border border-[#E7B85B]/20">
                      Tư liệu lịch sử
                    </span>
                    <span className="text-[#64748B] flex items-center gap-1 font-semibold">
                      <CalendarBlank size={14} />
                      {new Date(e.startTime).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-[#17211C] leading-snug">
                      {e.title}
                    </h3>
                    <p className="text-sm text-[#575E5B] leading-relaxed">
                      {e.description || "Hoạt động được ghi nhận trong các bài viết tư liệu của trường."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#16845A]">
                      {e.club?.name || "Đại học Nông – Lâm Bắc Giang"}
                    </span>
                    {e.sourceUrl && (
                      <a
                        href={e.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0F5132] hover:text-[#16845A] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Bài viết nguồn ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#D8D5CD] rounded-xl p-10 text-center space-y-3">
              <span className="inline-block p-3 rounded-full bg-[#F4F1EA] text-[#0F5132]">
                <CalendarBlank size={28} />
              </span>
              <h3 className="font-display font-bold text-lg text-[#17211C]">
                Chưa có sự kiện sắp tới được xác minh công bố
              </h3>
              <p className="text-sm text-[#575E5B] max-w-md mx-auto">
                Lịch hoạt động mới sẽ được hiển thị tại đây ngay khi có thông báo chính thức từ ban chủ nhiệm các câu lạc bộ và Đoàn trường.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 07: Kết nối cộng đồng (Full-Width High-End CTA Banner) */}
      <section className="py-20 lg:py-24 bg-[#0F5132] text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#16845A]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E7B85B]/15 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="editorial-container relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#A7F3D0] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            KẾT NỐI & PHÁT TRIỂN
          </span>

          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-tight">
            SẴN SÀNG TÌM MỘT CỘNG ĐỒNG
            <br />
            <span className="text-[#E7B85B]">CHO RIÊNG BẠN?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl mx-auto">
            Khám phá các câu lạc bộ thanh xuân, học hỏi kỹ năng mới và kết nối cùng những người bạn đồng hành trong suốt quãng đời sinh viên tại BAFU.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/clubs"
              className="px-8 py-4 bg-[#E7B85B] hover:bg-[#D9A33E] text-[#17211C] font-bold uppercase tracking-wider text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Khám phá danh bạ CLB
            </Link>
            <Link
              to="/events"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-sm rounded-lg backdrop-blur-md transition-all duration-300 border border-white/20"
            >
              Tra cứu hoạt động
            </Link>
          </div>

          <p className="text-xs text-white/60 pt-4">
            Dự án cổng thông tin thí điểm phục vụ sinh viên Trường Đại học Nông – Lâm Bắc Giang.
          </p>
        </div>
      </section>

      {/* Lightbox Modal for Editorial Gallery */}
      {activeLightboxMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveLightboxMedia(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveLightboxMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black">
              <img
                src={activeLightboxMedia.src}
                alt={activeLightboxMedia.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-3 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F5132] uppercase tracking-wider">
                  {activeLightboxMedia.scope}
                </span>
                <span className="text-[#64748B]">
                  Nguồn: {activeLightboxMedia.source}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-[#17211C]">
                {activeLightboxMedia.title}
              </h3>

              <p className="text-sm text-[#575E5B] leading-relaxed">
                {activeLightboxMedia.caption}
              </p>

              {activeLightboxMedia.sourceUrl && (
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <a
                    href={activeLightboxMedia.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#0F5132] hover:underline inline-flex items-center gap-1"
                  >
                    Xem bài viết nguồn trên bafu.edu.vn ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
