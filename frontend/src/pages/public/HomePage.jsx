import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, Trophy, Calendar, Sparkles, ArrowRight, Search, 
  CheckCircle2, Clock, MapPin, ChevronRight, GraduationCap, Flame
} from 'lucide-react';

export default function HomePage() {
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

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Cổng Thông Tin Câu Lạc Bộ Đại Học Nông - Lâm Bắc Giang
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Cháy Hết Mình Cùng <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                  Thanh Xuân Đại Học
                </span>
              </h1>

              <p className="text-lg text-blue-100 max-w-2xl font-normal leading-relaxed">
                Nơi hội tụ hơn 10+ Câu lạc bộ Thể thao, Học thuật, Văn nghệ và Tình nguyện. Đăng ký trực tuyến, nộp hồ sơ xét tuyển nhanh chóng và phát triển bản thân vượt bậc!
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/clubs"
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg shadow-amber-400/25 transition-all flex items-center gap-2 hover:scale-102"
                >
                  Khám phá CLB ngay
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/clubs?recruiting=true"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                  Đợt tuyển đang mở
                </Link>
              </div>

              {/* Live Real Stats Banner */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15">
                <div>
                  <div className="text-3xl font-extrabold text-white">{stats.totalClubs}+</div>
                  <div className="text-xs text-blue-200 font-medium">Câu lạc bộ</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{stats.totalMembers}+</div>
                  <div className="text-xs text-blue-200 font-medium">Hội viên sinh viên</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-amber-300">{stats.totalCampaigns}</div>
                  <div className="text-xs text-blue-200 font-medium">Đợt tuyển đang mở</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{stats.totalEvents}+</div>
                  <div className="text-xs text-blue-200 font-medium">Sự kiện thường niên</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Cards */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto max-w-sm">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-sm font-semibold">Tuyển thành viên 2026</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">Trực tuyến 100%</span>
                  </div>

                  <div className="bg-white/15 rounded-2xl p-4 space-y-2">
                    <div className="text-xs text-blue-200 font-medium">Đợt tuyển nổi bật</div>
                    <div className="font-bold text-white text-base">BAFU Tech — Lập trình & Sáng tạo số</div>
                    <div className="text-xs text-blue-100 flex items-center justify-between pt-1">
                      <span>Chỉ tiêu: 25 thành viên</span>
                      <span className="text-amber-300 font-semibold">Đang nhận đơn</span>
                    </div>
                  </div>

                  <div className="bg-white/15 rounded-2xl p-4 space-y-2">
                    <div className="text-xs text-blue-200 font-medium">Đợt tuyển thử giọng</div>
                    <div className="font-bold text-white text-base">CLB Âm Nhạc & Guitar Melody</div>
                    <div className="text-xs text-blue-100 flex items-center justify-between pt-1">
                      <span>Vocalist & Guitar</span>
                      <span className="text-amber-300 font-semibold">Đang nhận đơn</span>
                    </div>
                  </div>

                  <Link
                    to="/clubs"
                    className="block w-full text-center py-2.5 rounded-xl bg-white text-blue-800 font-bold text-sm hover:bg-blue-50 transition-colors"
                  >
                    Xem tất cả câu lạc bộ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Danh mục lĩnh vực hoạt động */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lĩnh Vực Hoạt Động
            </h2>
            <p className="text-slate-500 text-sm mt-1">Tìm kiếm câu lạc bộ đúng với đam mê và kỹ năng của bạn</p>
          </div>
          <Link to="/clubs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/clubs?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all text-center flex flex-col items-center card-hover"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {cat.icon === 'Trophy' ? <Trophy className="w-7 h-7" /> : <Users className="w-7 h-7" />}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {cat._count?.clubs || 0} CLB trực thuộc
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CLB Đang Tuyển Thành Viên */}
      {recruitingClubs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200/70">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  Đang mở đợt tuyển sinh
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Gia Nhập Các Câu Lạc Bộ Ngay Hôm Nay
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Đừng bỏ lỡ cơ hội trở thành thành viên chính thức trong đợt tuyển thành viên học kỳ này
                </p>
              </div>
              <Link
                to="/clubs?recruiting=true"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-1.5"
              >
                Xem tất cả đợt tuyển
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recruitingClubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-2xl border border-amber-200/60 p-5 shadow-xs flex flex-col justify-between card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                        Đang nhận hồ sơ
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{club.category?.name}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
                      {club.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                      {club.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {club._count?.memberships || 0} thành viên
                    </span>
                    <Link
                      to={`/clubs/${club.slug}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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

      {/* 4. Quy trình 4 bước tham gia CLB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quy Trình Ứng Tuyển & Kích Hoạt Hội Viên
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Hệ thống hóa toàn bộ quy trình từ khâu nộp đơn trực tuyến đến khi được công nhận hội viên chính thức
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Chọn Câu Lạc Bộ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khám phá các CLB phù hợp với năng khiếu, sở thích và lịch học của bản thân.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Nộp Đơn Trực Tuyến</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hoàn thành bộ câu hỏi ứng tuyển do từng CLB thiết lập một cách chân thực nhất.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Xét Duyệt & Phỏng Vấn</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ban chủ nhiệm xem xét hồ sơ, hẹn lịch phỏng vấn và chấm điểm minh bạch.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 font-black text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Kích Hoạt Thành Viên</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khi được duyệt chấp thuận, hệ thống tự động kích hoạt tư cách hội viên CLB ngay lập tức.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Câu Lạc Bộ Tiêu Biểu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Câu Lạc Bộ Tiêu Biểu
            </h2>
            <p className="text-slate-500 text-sm mt-1">Các câu lạc bộ có hoạt động phong trào sôi nổi nhất trường</p>
          </div>
          <Link to="/clubs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Xem tất cả CLB <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {club.name.charAt(4) || 'C'}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {club.category?.name}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 hover:text-blue-600 transition-colors">
                  <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {club.shortDescription}
                </p>

                {club.meetingSchedule && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{club.meetingSchedule}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {club._count?.memberships || 0} hội viên
                </span>
                <Link
                  to={`/clubs/${club.slug}`}
                  className="px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sự Kiện Sắp Diễn Ra */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sự Kiện Sắp Diễn Ra
              </h2>
              <p className="text-slate-500 text-sm mt-1">Các giải thi đấu, đêm nhạc và hội thảo học thuật của sinh viên</p>
            </div>
            <Link to="/events" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Xem tất cả sự kiện <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ev.startTime).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{ev.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{ev.club?.name}</span>
                  <Link
                    to="/events"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Xem chi tiết →
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
