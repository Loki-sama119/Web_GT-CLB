import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  MagnifyingGlass, 
  Compass, 
  CalendarDots, 
  ArrowRight, 
  UsersThree, 
  Sparkle, 
  Clock, 
  MapPin, 
  CaretRight, 
  CheckCircle, 
  Flame,
  Code,
  Trophy,
  HandHeart,
  Palette,
  Lightbulb,
  GraduationCap,
  CaretDown
} from '@phosphor-icons/react';
import ClubLogo from '../../components/ui/ClubLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClubs: 10,
    totalMembers: 56,
    totalCampaigns: 2,
    totalEvents: 5
  });
  const [categories, setCategories] = useState([]);
  const [recruitingClubs, setRecruitingClubs] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [statsRes, catRes, recRes, featRes, evRes] = await Promise.all([
          api.getStatsOverview().catch(() => null),
          api.getCategories().catch(() => null),
          api.getClubs({ recruiting: 'true', limit: 4 }).catch(() => null),
          api.getClubs({ limit: 6 }).catch(() => null),
          api.getEvents({ limit: 3 }).catch(() => null)
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (catRes?.data?.categories) setCategories(catRes.data.categories);
        if (recRes?.data?.clubs) setRecruitingClubs(recRes.data.clubs);
        if (featRes?.data?.clubs) setFeaturedClubs(featRes.data.clubs);
        if (evRes?.data?.events) setEvents(evRes.data.events);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/clubs?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/clubs');
    }
  };

  const getCategoryDuotoneIcon = (slug = '') => {
    if (slug.includes('hoc-thuat') || slug.includes('cong-nghe')) return Code;
    if (slug.includes('the-thao')) return Trophy;
    if (slug.includes('tinh-nguyen')) return HandHeart;
    if (slug.includes('nghe-thuat') || slug.includes('am-nhac')) return Palette;
    if (slug.includes('ky-nang')) return Lightbulb;
    return Compass;
  };

  const getCoverGradient = (categorySlug = '') => {
    if (categorySlug.includes('hoc-thuat')) return 'from-[#142B49] via-[#1E3A5F] to-[#167C66]';
    if (categorySlug.includes('the-thao')) return 'from-[#0D5C75] via-[#148A9C] to-[#167C66]';
    if (categorySlug.includes('nghe-thuat')) return 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]';
    if (categorySlug.includes('tinh-nguyen')) return 'from-[#167C66] via-[#1E9E82] to-[#2DD4BF]';
    return 'from-[#142B49] via-[#1E3A5F] to-[#F3B846]';
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION — EDITORIAL CAMPUS LAYOUT */}
      <section className="bg-white border-b border-[#E2E8F0] pt-10 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Cột Trái: Nội dung định hướng (48% - 5 cột rộng) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#167C66] tracking-wide">
                <Sparkle size={14} weight="fill" className="text-[#F3B846]" />
                <span>BAFU CLUB PORTAL • CỔNG KẾT NỐI SINH VIÊN</span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight leading-[1.15] text-[#142B49]">
                Tìm đúng câu lạc bộ.{' '}
                <span className="text-[#167C66] block sm:inline">
                  Bắt đầu hành trình của bạn.
                </span>
                <span className="sr-only"> — Cháy Hết Mình Cùng CLB Sinh Viên BAFU</span>
              </h1>

              {/* Subheading */}
              <p className="text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                Khám phá các câu lạc bộ sinh viên, tìm hoạt động phù hợp và ứng tuyển trực tuyến ngay tại Trường Đại học Nông - Lâm Bắc Giang.
              </p>

              {/* Search Bar trực diện */}
              <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <div className="relative grow">
                  <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Tìm theo tên CLB (BAFU Tech, Cầu Lông, Tình Nguyện...)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#167C66] focus:bg-white transition-all shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-98"
                >
                  <MagnifyingGlass size={18} weight="bold" />
                  Tìm CLB
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/clubs"
                  className="px-5 py-2.5 rounded-xl bg-[#142B49] text-white hover:bg-[#0E1F35] font-semibold text-sm transition-all flex items-center gap-2 shadow-xs"
                >
                  <Compass size={18} weight="bold" />
                  Khám phá CLB ngay
                </Link>
                <Link
                  to="/events"
                  className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <CalendarDots size={18} />
                  Lịch sự kiện
                </Link>
              </div>

              {/* Subtle Trust Indicators */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600" />
                  <span>Cổng kết nối CLB sinh viên</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600" />
                  <span>Nộp đơn trực tuyến 100%</span>
                </div>
              </div>
            </div>

            {/* Cột Phải: Photo Collage sinh viên BAFU chân thực (52% - 6 cột) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Ảnh chính: Hoạt động sinh viên chào tân sinh viên thực tế BAFU */}
                <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100 aspect-4/3 relative">
                  <img
                    src="/images/bafu/students-welcome-2025.jpg"
                    alt="Sinh viên BAFU tham gia hoạt động chào đón tân sinh viên trường Đại học Nông - Lâm Bắc Giang"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Hoạt Động Sinh Viên BAFU</span>
                    <p className="text-xs text-slate-200 font-medium line-clamp-1">Không gian gắn kết, năng động và giàu trải nghiệm ngoại khóa</p>
                  </div>
                </div>

                {/* Ảnh phụ lồng ghép (Photo Collage): Khuôn viên tổng quan Trường Đại học Nông - Lâm Bắc Giang */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src="/images/bafu/campus-overview.jpg"
                    alt="Khuôn viên tổng quan Trường Đại học Nông - Lâm Bắc Giang"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Floating Social Proof Card */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#E2E8F0] shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#167C66] flex items-center justify-center font-bold">
                    <UsersThree size={22} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#142B49]">{stats.totalClubs} Câu Lạc Bộ</div>
                    <div className="text-[11px] text-slate-500 font-medium">Sẵn sàng chào đón bạn</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. RECRUITMENT SECTION — CÁC CLB ĐANG TUYỂN THÀNH VIÊN (Dedicated Section) */}
      {recruitingClubs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                <Flame size={14} weight="fill" className="text-amber-600" />
                <span>Đang tiếp nhận hồ sơ trực tuyến</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
                Những câu lạc bộ đang tuyển thành viên
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Các đợt tuyển quân chính thức của câu lạc bộ trực thuộc trường trong học kỳ này
              </p>
            </div>
            <Link
              to="/clubs?recruiting=true"
              className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1.5 shrink-0"
            >
              <span>Xem tất cả đợt tuyển</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recruitingClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs hover:border-[#167C66] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <ClubLogo
                      name={club.name}
                      logoUrl={club.logoUrl}
                      categorySlug={club.category?.slug}
                      size="md"
                    />
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Đang nhận đơn
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    {club.category?.name}
                  </div>
                  <h3 className="font-bold text-[#142B49] text-sm leading-snug line-clamp-2 mb-2 hover:text-[#167C66] transition-colors">
                    <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {club.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Hạn nộp: 30/11/2026
                  </span>
                  <Link
                    to={`/clubs/${club.slug}`}
                    className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1"
                  >
                    Xem đợt tuyển <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. CATEGORIES SECTION — LĨNH VỰC HOẠT ĐỘNG (Phosphor Duotone) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass size={16} weight="duotone" />
              <span>Phân loại tổ chức</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
              Lĩnh Vực Hoạt Động
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Khám phá các nhóm câu lạc bộ theo sở thích, năng khiếu và định hướng kỹ năng
            </p>
          </div>
          <Link to="/clubs" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
            Xem toàn bộ CLB <CaretRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const DuotoneIcon = getCategoryDuotoneIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/clubs?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#167C66] hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#142B49] flex items-center justify-center font-bold mb-4 group-hover:bg-[#167C66] group-hover:text-white transition-colors">
                  <DuotoneIcon size={26} weight="duotone" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#167C66] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {cat._count?.clubs || 0} câu lạc bộ
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED CLUBS — CÂU LẠC BỘ TIÊU BIỂU (3 Columns Desktop, 16:9 Cover) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <UsersThree size={16} weight="duotone" />
              <span>Gương mặt tiêu biểu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
              Câu Lạc Bộ Tiêu Biểu
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Các tổ chức sinh viên có bề dày hoạt động và phong trào sôi nổi nhất toàn trường
            </p>
          </div>
          <Link to="/clubs" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
            Xem tất cả câu lạc bộ <CaretRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClubs.map((club) => {
            const gradient = getCoverGradient(club.category?.slug);
            return (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Cover 16:9 với ảnh thực tế hoặc gradient chuyên nghiệp */}
                  <div className="h-36 relative overflow-hidden bg-slate-100 flex items-end p-4">
                    {club.coverUrl ? (
                      <img
                        src={club.coverUrl}
                        alt={club.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} flex items-center justify-center p-3 opacity-90`}>
                        <span className="text-white/20 font-black text-xs tracking-wider uppercase select-none text-center">
                          {club.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-[#142B49] shadow-2xs">
                        {club.category?.name}
                      </span>
                    </div>
                  </div>

                  {/* Logo CLB chồng nhẹ lên ranh giới cover/body */}
                  <div className="px-5 -mt-6 flex items-end justify-between">
                    <ClubLogo
                      name={club.name}
                      logoUrl={club.logoUrl}
                      categorySlug={club.category?.slug}
                      size="lg"
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="text-xs text-slate-500 font-medium pb-1">
                      {club._count?.memberships || 0} hội viên
                    </span>
                  </div>

                  {/* Club Body Info */}
                  <div className="p-5 pt-3 space-y-3">
                    <h3 className="font-bold text-[#142B49] text-base leading-snug hover:text-[#167C66] transition-colors">
                      <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {club.shortDescription}
                    </p>

                    {club.meetingSchedule && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Clock size={16} className="text-[#167C66] shrink-0" />
                        <span className="truncate">{club.meetingSchedule}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Hoạt động định kỳ
                  </span>
                  <Link
                    to={`/clubs/${club.slug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#142B49] hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    Xem chi tiết <CaretRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. EVENTS SECTION — SỰ KIỆN CỘNG ĐỒNG BAFU */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CalendarDots size={16} weight="duotone" />
                <span>Hoạt động phong trào</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
                Sự Kiện Sắp Diễn Ra
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Lịch trình hội thảo, thi đấu giao hữu và chiến dịch tình nguyện sinh viên
              </p>
            </div>
            <Link to="/events" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
              Xem toàn bộ sự kiện <CaretRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#167C66] font-bold mb-2">
                    <CalendarDots size={16} weight="fill" />
                    <span>{new Date(ev.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-[#142B49] text-base mb-2 leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{ev.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px]">{ev.club?.name}</span>
                  <Link
                    to="/events"
                    className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1"
                  >
                    Xem chi tiết <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. STATISTICS STRIP — SỐ LIỆU MINH BẠCH TỪ HỆ THỐNG */}
      <section className="bg-slate-50 border-y border-[#E2E8F0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-black text-[#142B49]">{stats.totalClubs}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Câu lạc bộ</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-[#167C66]">{stats.totalMembers}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Hội viên sinh viên</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-[#F3B846]">{stats.totalCampaigns}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Đợt tuyển đang mở</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-[#142B49]">{stats.totalEvents}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Sự kiện năm học</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
