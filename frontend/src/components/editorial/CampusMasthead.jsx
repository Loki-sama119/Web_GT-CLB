import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, ArrowRight, Sparkle } from '@phosphor-icons/react';

/**
 * CampusMasthead - Phần đầu trang chủ phong cách Editorial BAFU
 * Bố cục bất đối xứng 12 cột, ảnh sinh viên BAFU thật, typography Oswald khổng lồ
 */
export default function CampusMasthead({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  stats = { totalClubs: 10, totalMembers: 56, totalEvents: 5 }
}) {
  return (
    <div className="border-b border-[#D8D5CD] bg-[#F4F0E7]">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Cột Trái (5/12 cột): Typography báo chí, thông điệp và tìm kiếm */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D8D5CD]">
            <div className="space-y-6">
              {/* Eyebrow báo chí */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#12674D]">
                <span className="w-2 h-2 bg-[#EF673F]" />
                <span>Bản tin tuyển quân & hoạt động sinh viên 2026</span>
              </div>

              {/* H1 Display Heading khổng lồ - Oswald */}
              <h1 className="font-display font-bold uppercase text-5xl sm:text-6xl lg:text-[74px] leading-[0.98] tracking-[-0.02em] text-[#181C1B]">
                TÌM CÂU LẠC BỘ<br />
                <span className="text-[#12674D]">ĐÚNG CHẤT BẠN</span>
                <span className="sr-only"> — Cháy Hết Mình Cùng CLB Sinh Viên BAFU</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-[#575E5B] leading-relaxed max-w-md font-normal">
                Khám phá cộng đồng sinh viên BAFU, tìm hoạt động phù hợp và đăng ký tham gia trực tuyến.
              </p>

              {/* Search Bar phong cách Editorial: phẳng, viền 1px, dứt khoát */}
              <form onSubmit={onSearchSubmit} className="pt-2">
                <div className="flex flex-col sm:flex-row border border-[#181C1B] bg-white">
                  <div className="flex items-center px-3.5 py-3 grow">
                    <MagnifyingGlass size={20} className="text-[#575E5B] shrink-0 mr-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Tìm kiếm theo tên câu lạc bộ..."
                      className="w-full text-sm text-[#181C1B] placeholder-[#7A827F] bg-transparent focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#181C1B] hover:bg-[#12674D] text-white text-sm font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Tìm kiếm</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Dải CTA và liên kết nhanh */}
            <div className="pt-8 flex items-center gap-4">
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#EF673F] hover:bg-[#D9532B] text-white font-semibold text-sm uppercase tracking-wider transition-colors shadow-none"
              >
                <span>Khám phá CLB ngay</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-[#181C1B] hover:text-[#12674D] font-semibold text-sm transition-colors"
              >
                <span>Xem lịch sự kiện</span>
              </Link>
            </div>
          </div>

          {/* Cột Phải (7/12 cột): Ảnh hoạt động sinh viên BAFU thật & Khối số liệu Thụy Sĩ */}
          <div className="lg:col-span-7 flex flex-col justify-between relative bg-white">
            {/* Khối ảnh chụp hoạt động sinh viên BAFU thật */}
            <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden border-b border-[#D8D5CD]">
              <img
                src="/images/bafu/students-welcome-2025.jpg"
                alt="Sinh viên BAFU chào đón tân sinh viên và ngày hội câu lạc bộ"
                className="w-full h-full object-cover object-center grayscale-[15%] hover:grayscale-0 transition-all duration-700"
              />
              {/* Nhãn caption báo chí trên ảnh */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#181C1B]/90 via-[#181C1B]/50 to-transparent p-6 text-white flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-[#EF673F] font-bold">
                    Tư liệu thực tế BAFU 2026
                  </div>
                  <div className="text-sm sm:text-base font-semibold">
                    Không gian năng động — Kết nối hơn 10 câu lạc bộ sinh viên
                  </div>
                </div>
                <div className="hidden sm:block text-right text-xs text-white/70">
                  Khuôn viên Việt Yên, Bắc Giang
                </div>
              </div>
            </div>

            {/* Thanh số liệu thống kê (Swiss Metrics Ticker) */}
            <div className="grid grid-cols-3 divide-x divide-[#D8D5CD] bg-[#F4F0E7] border-t border-[#D8D5CD]">
              <div className="p-4 sm:p-6">
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#181C1B]">
                  {stats.totalClubs}+
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#575E5B] mt-1">
                  Câu lạc bộ
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#12674D]">
                  {stats.totalMembers * 10}+
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#575E5B] mt-1">
                  Hội viên sinh viên
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#EF673F]">
                  100%
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-[#575E5B] mt-1">
                  Tuyển online
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
