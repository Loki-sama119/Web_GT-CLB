import React from "react";
import {
  MagnifyingGlass,
  ArrowRight,
  ArrowUpRight,
  Sparkle,
  Compass,
  CheckCircle,
} from "@phosphor-icons/react";

export default function CampusMasthead({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  stats,
}) {
  const quickFilters = [
    { label: "Tất cả", query: "" },
    { label: "🤝 Tình nguyện", query: "tình nguyện" },
    { label: "🩸 Hiến máu", query: "hiến máu" },
    { label: "💻 Tin học", query: "tin học" },
    { label: "💡 Khởi nghiệp", query: "khởi nghiệp" },
    { label: "🎭 Văn nghệ", query: "văn nghệ" },
  ];

  return (
    <section className="relative w-full min-h-[680px] lg:min-h-[760px] flex flex-col justify-between overflow-hidden bg-[#17211C] select-none text-white">
      {/* 1. Authentic BAFU Campus Panoramic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/bafu/campus-overview.jpg"
          alt="Khuôn viên Trường Đại học Nông – Lâm Bắc Giang"
          className="w-full h-full object-cover object-center scale-100 animate-fade-in"
          loading="eager"
        />
        {/* Multi-stop deep dark overlay ensuring exceptional contrast and editorial refinement */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17211C]/95 via-[#17211C]/85 to-[#0F5132]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17211C] via-transparent to-[#17211C]/40" />
      </div>

      {/* 2. Top Header Sub-bar */}
      <div className="relative z-10 w-full border-b border-white/10 py-3.5 backdrop-blur-xs">
        <div className="editorial-container flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-white/90 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs">
              TRƯỜNG ĐẠI HỌC NÔNG – LÂM BẮC GIANG
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/70 hidden sm:inline text-[11px]">
              Việt Yên, Bắc Giang
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E7B85B] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/15">
              <CheckCircle size={13} weight="fill" />
              <span>CỔNG THÔNG TIN THÍ ĐIỂM</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Hero Main Content Area */}
      <div className="relative z-10 editorial-container my-auto py-12 sm:py-16 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16845A]/30 border border-[#34D399]/30 text-[#A7F3D0] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
            <Sparkle size={14} weight="fill" className="text-[#E7B85B]" />
            <span>Không gian kết nối thanh xuân • BAFU Student Life</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase text-white tracking-tight leading-[1.08] drop-shadow-sm">
            KHÁM PHÁ CỘNG ĐỒNG
            <br />
            <span className="text-[#E7B85B] underline decoration-[#16845A]/50 decoration-wavy decoration-2">
              SINH VIÊN BAFU
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#E2E8F0] text-base sm:text-xl font-normal leading-relaxed max-w-2xl drop-shadow-xs">
            Khám phá sở thích, kết nối bạn bè và tìm hiểu những hoạt động sinh viên tại Trường Đại học Nông – Lâm Bắc Giang.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#kham-pha"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#16845A] hover:bg-[#0F5132] text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-[#34D399]/30 cursor-pointer"
            >
              <span>Khám phá câu lạc bộ</span>
              <ArrowUpRight size={20} weight="bold" />
            </a>

            <a
              href="#hoat-dong"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-lg backdrop-blur-md transition-all duration-300 border border-white/25 hover:border-white/50 cursor-pointer"
            >
              <Compass size={20} weight="bold" className="text-[#E7B85B]" />
              <span>Tìm hiểu hoạt động</span>
            </a>
          </div>

          {/* Floating Search Bar */}
          <div className="pt-4 max-w-2xl">
            <form
              onSubmit={onSearchSubmit}
              role="search"
              className="relative flex items-center bg-white/95 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-[#16845A]"
            >
              <div className="pl-3 pr-2 text-[#0F5132]">
                <MagnifyingGlass size={22} weight="bold" />
              </div>
              <input
                aria-label="Tìm kiếm câu lạc bộ"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm câu lạc bộ (VD: Tình nguyện, Tin học, Hiến máu...)"
                className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-[#17211C] bg-transparent outline-none placeholder:text-[#64748B] font-medium"
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="bg-[#0F5132] hover:bg-[#16845A] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="hidden sm:inline text-xs uppercase tracking-wider">Tìm kiếm</span>
                <ArrowRight size={18} weight="bold" />
              </button>
            </form>

            {/* Category Quick Tags */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 text-xs">
              <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
                Gợi ý:
              </span>
              {quickFilters.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => onSearchChange(q.query)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer backdrop-blur-xs ${
                    searchQuery === q.query
                      ? "bg-[#E7B85B] text-[#17211C] font-bold shadow-xs"
                      : "bg-white/10 hover:bg-white/25 text-white/90 border border-white/15"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Metrics & Source Disclaimer Bar */}
      <div className="relative z-10 w-full bg-[#111A16]/90 border-t border-white/10 backdrop-blur-md py-4">
        <div className="editorial-container flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Verified Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full md:w-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#E7B85B] leading-none">
                0{stats?.totalClubs ?? 5}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-white/70 uppercase tracking-wider mt-1">
                Hồ sơ CLB có nguồn
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#34D399] leading-none">
                0{stats?.totalEvents ?? 2}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-white/70 uppercase tracking-wider mt-1">
                Tư liệu hoạt động
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-white leading-none">
                100%
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-white/70 uppercase tracking-wider mt-1">
                Đối chiếu nguồn tin
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#60A5FA] leading-none">
                Thí điểm
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-white/70 uppercase tracking-wider mt-1">
                Cổng kết nối sinh viên
              </div>
            </div>
          </div>

          {/* Photo Provenance Attribution */}
          <div className="text-[11px] text-white/60 text-right md:max-w-xs leading-snug">
            <span className="text-[#34D399] font-semibold">Tư liệu hình ảnh:</span> Toàn cảnh khuôn viên Trường ĐH Nông – Lâm Bắc Giang (Nguồn: <a href="https://bafu.edu.vn" target="_blank" rel="noreferrer" className="underline hover:text-white">bafu.edu.vn</a>)
          </div>
        </div>
      </div>
    </section>
  );
}
