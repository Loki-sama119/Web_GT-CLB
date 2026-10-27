import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, UsersRound, Clock, Flame, ChevronLeft, ChevronRight, Sparkles, Filter, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ClubLogo from '../../components/ui/ClubLogo';
import EmptyState from '../../components/ui/EmptyState';

export default function ClubsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const recruitingParam = searchParams.get('recruiting') === 'true';
  const querySearch = searchParams.get('search') || '';

  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [onlyRecruiting, setOnlyRecruiting] = useState(recruitingParam);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        if (res.data?.categories) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  const fetchClubs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.getClubs({
        search,
        category: selectedCategory,
        recruiting: onlyRecruiting ? 'true' : undefined,
        page,
        limit: 9
      });
      if (res.data?.clubs) {
        setClubs(res.data.clubs);
        setMeta(res.meta || { page: 1, totalPages: 1, total: res.data.clubs.length });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs(1);
  }, [selectedCategory, onlyRecruiting]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchClubs(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setOnlyRecruiting(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="campus-hero-gradient rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#F3B846]" />
            <span>Danh bạ chính thức BAFU</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Danh Sách Câu Lạc Bộ Sinh Viên
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Khám phá hơn 10+ câu lạc bộ học thuật, thể thao và tình nguyện. Tìm kiếm môi trường phù hợp để rèn luyện kỹ năng mềm và nộp đơn trực tuyến.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên câu lạc bộ, mô tả, từ khóa hoạt động..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Xóa nội dung đã nhập"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="success" size="md" icon={Search}>
            Tìm kiếm
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-[#142B49] text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Tất cả ({meta.total || clubs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#142B49] text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Toggle Recruiting */}
          <button
            onClick={() => setOnlyRecruiting(!onlyRecruiting)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              onlyRecruiting
                ? 'bg-[#167C66] text-white border-[#167C66] shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyRecruiting ? 'fill-white' : 'text-amber-500 fill-amber-500'}`} />
            Chỉ xem CLB đang mở tuyển
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Không tìm thấy câu lạc bộ phù hợp"
          description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại các bộ lọc chuyên mục."
          actionLabel="Đặt lại bộ lọc"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isRecruiting = (club._count?.campaigns || 0) > 0;
            return (
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
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="navy" size="sm">
                        {club.category?.name}
                      </Badge>
                      {isRecruiting && (
                        <Badge variant="warning" size="sm" icon={Flame}>
                          Đang nhận đơn
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 hover:text-[#167C66] transition-colors">
                    <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
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
                    <Button variant="primary" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => fetchClubs(meta.page - 1)}
            icon={ChevronLeft}
          >
            Trang trước
          </Button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            Trang {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchClubs(meta.page + 1)}
            icon={ChevronRight}
            iconPosition="right"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
