import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  UsersRound, Trophy, CalendarDays, Sparkles, ArrowRight, Search, 
  CheckCircle2, Clock, MapPin, ChevronRight, GraduationCap, Flame,
  Compass, ClipboardList, HeartHandshake, Palette, BookOpen, UserRoundPlus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ClubLogo from '../../components/ui/ClubLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClubs: 10,
    totalMembers: 240,
    totalCampaigns: 2,
    totalEvents: 2
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

  const getCategoryIcon = (slug = '') => {
    if (slug.includes('hoc-thuat') || slug.includes('cong-nghe')) return BookOpen;
    if (slug.includes('the-thao')) return Trophy;
    if (slug.includes('tinh-nguyen')) return HeartHandshake;
    if (slug.includes('nghe-thuat') || slug.includes('am-nhac')) return Palette;
    return Compass;
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden campus-hero-gradient text-white py-16 sm:py-24">
        {/* Subtle background academic pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F3B846]" />
                <span>Cổng Thông Tin Câu Lạc Bộ Sinh Viên BAFU</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Cháy Hết Mình Cùng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3B846] to-amber-200">
                  Thanh Xuân Đại Học
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-xl font-normal leading-relaxed">
                Nơi hội tụ hơn 10+ Câu lạc bộ Học thuật, Thể thao, Tình nguyện và Nghệ thuật trường Đại học Nông - Lâm Bắc Giang. Nộp đơn trực tuyến, theo dõi tiến độ xét duyệt và nhận thông báo chính thức!
              </p>

              {/* Quick Hero Search Input */}
              <form onSubmit={handleHeroSearch} className="max-w-xl flex flex-col sm:flex-row gap-2 pt-2">
                <div className="relative grow">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Tìm theo tên CLB (BAFU Tech, Cầu Lông, Tình Nguyện...)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#167C66] shadow-md"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  Tìm CLB
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/clubs">
                  <Button variant="outline" size="md" icon={Compass} className="bg-white/10 hover:bg-white/20 text-white border-white/25">
                    Khám phá CLB ngay
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="ghost" size="md" icon={CalendarDays} className="text-slate-200 hover:text-white hover:bg-white/10">
                    Lịch sự kiện
                  </Button>
                </Link>
              </div>

              {/* Real Stats Metric Counters */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalClubs}+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Câu lạc bộ</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalMembers}+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Hội viên sinh viên</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#F3B846]">{stats.totalCampaigns}</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Đợt tuyển đang mở</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalEvents}+</div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Sự kiện năm học</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Highlight Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-100">Đợt tuyển sinh hoạt động</span>
                  </div>
                  <Badge variant="warning" size="sm">Học kỳ hiện tại</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">CLB Lập Trình BAFU Tech</span>
                      <span className="text-[#F3B846] font-bold">Đang nhận đơn</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      Tuyển thành viên Ban Chuyên môn & Ban Truyền thông học kỳ mới.
                    </p>
                    <Link to="/clubs/bafu-tech" className="text-xs font-bold text-white hover:text-[#F3B846] flex items-center gap-1 pt-1">
                      Xem form ứng tuyển <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">CLB Âm Nhạc & Guitar BAFU</span>
                      <span className="text-[#F3B846] font-bold">Thử giọng</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      Tìm kiếm giọng ca mới và tay đàn guitar cho chuỗi sự kiện chào tân sinh viên.
                    </p>
                    <Link to="/clubs/am-nhac-guitar" className="text-xs font-bold text-white hover:text-[#F3B846] flex items-center gap-1 pt-1">
                      Xem chi tiết CLB <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/clubs?recruiting=true" className="block text-center py-2.5 rounded-xl bg-white text-[#142B49] font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs">
                    Xem tất cả đợt tuyển đang mở
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Lĩnh vực hoạt động (Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Phân loại câu lạc bộ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
              Lĩnh Vực Hoạt Động
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Khám phá các câu lạc bộ theo đúng sở thích, năng khiếu và định hướng của bạn
            </p>
          </div>
          <Link to="/clubs" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
            Xem tất cả CLB <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const CatIcon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/clubs?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#167C66]/40 hover:shadow-md transition-all text-left flex flex-col justify-between campus-card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-[#142B49]/5 text-[#142B49] flex items-center justify-center font-bold mb-4 group-hover:bg-[#167C66] group-hover:text-white transition-colors">
                  <CatIcon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#167C66] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {cat._count?.clubs || 0} câu lạc bộ trực thuộc
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. CLB Đang mở đợt tuyển thành viên (Recruiting Highlight) */}
      {recruitingClubs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 border border-amber-200/70 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2 border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  Đang nhận hồ sơ trực tuyến
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#142B49] tracking-tight">
                  Các Câu Lạc Bộ Đang Mở Đợt Tuyển
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Đừng bỏ lỡ cơ hội gia nhập và trở thành hội viên chính thức trong đợt tuyển sinh này
                </p>
              </div>
              <Link to="/clubs?recruiting=true">
                <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                  Xem tất cả đợt tuyển
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {recruitingClubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between campus-card-hover"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <ClubLogo
                        name={club.name}
                        logoUrl={club.logoUrl}
                        categorySlug={club.category?.slug}
                        size="md"
                      />
                      <Badge variant="warning" size="sm">Đang nhận đơn</Badge>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-500 mb-1">
                      {club.category?.name}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 hover:text-[#167C66] transition-colors">
                      <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {club.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {club._count?.memberships || 0} hội viên
                    </span>
                    <Link
                      to={`/clubs/${club.slug}`}
                      className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1"
                    >
                      Ứng tuyển ngay <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Quy trình 4 bước tham gia CLB (Visual Timeline) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <ClipboardList className="w-4 h-4" />
            <span>Quy chuẩn xét tuyển</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
            Quy Trình Ứng Tuyển & Kích Hoạt Hội Viên
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Quy trình 4 bước tinh gọn giúp sinh viên tiếp cận và đồng hành cùng các câu lạc bộ tại BAFU
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#142B49] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Chọn Câu Lạc Bộ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khám phá danh sách các CLB học thuật, thể thao và tình nguyện phù hợp với sở thích của bạn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#167C66] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Nộp Đơn Trực Tuyến</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Điền biểu mẫu ứng tuyển động với các câu hỏi do Ban chủ nhiệm từng CLB thiết lập.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Xét Duyệt & Phỏng Vấn</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ban chủ nhiệm chấm điểm, xem xét câu trả lời và mời phỏng vấn trực tiếp hoặc online.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Kích Hoạt Hội Viên</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khi được duyệt chấp thuận, hệ thống tự động ghi nhận tư cách thành viên chính thức ngay lập tức.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Câu Lạc Bộ Tiêu Biểu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <UsersRound className="w-4 h-4" />
              <span>Cộng đồng sinh viên</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
              Câu Lạc Bộ Tiêu Biểu
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Các câu lạc bộ có bề dày hoạt động và phong trào sôi nổi nhất toàn trường
            </p>
          </div>
          <Link to="/clubs" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
            Xem tất cả câu lạc bộ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between campus-card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <ClubLogo
                    name={club.name}
                    logoUrl={club.logoUrl}
                    categorySlug={club.category?.slug}
                    size="lg"
                  />
                  <Badge variant="navy" size="sm">
                    {club.category?.name}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 hover:text-[#167C66] transition-colors">
                  <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {club.shortDescription}
                </p>

                {club.meetingSchedule && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                    <Clock className="w-3.5 h-3.5 text-[#167C66] shrink-0" />
                    <span className="truncate">{club.meetingSchedule}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {club._count?.memberships || 0} hội viên
                </span>
                <Link to={`/clubs/${club.slug}`}>
                  <Button variant="secondary" size="sm">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sự Kiện Sắp Diễn Ra */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <div className="text-xs font-bold text-[#167C66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                <span>Hoạt động phong trào</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B49] tracking-tight">
                Sự Kiện Sắp Diễn Ra
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Các giải thi đấu giao hữu, workshop học thuật và chiến dịch tình nguyện của sinh viên
              </p>
            </div>
            <Link to="/events" className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1 shrink-0">
              Xem toàn bộ sự kiện <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs campus-card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#167C66] font-bold mb-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{new Date(ev.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{ev.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 truncate max-w-[150px]">{ev.club?.name}</span>
                  <Link
                    to="/events"
                    className="text-xs font-bold text-[#167C66] hover:text-[#115E4D] flex items-center gap-1"
                  >
                    Xem chi tiết <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
