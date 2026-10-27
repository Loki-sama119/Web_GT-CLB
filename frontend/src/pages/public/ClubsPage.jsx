import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  MagnifyingGlass, 
  UsersThree, 
  Clock, 
  Flame, 
  CaretLeft, 
  CaretRight, 
  Sparkle, 
  X,
  Compass,
  ArrowRight
} from '@phosphor-icons/react';
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

  const getCoverGradient = (categorySlug = '') => {
    if (categorySlug.includes('hoc-thuat')) return 'from-[#142B49] via-[#1E3A5F] to-[#167C66]';
    if (categorySlug.includes('the-thao')) return 'from-[#0D5C75] via-[#148A9C] to-[#167C66]';
    if (categorySlug.includes('nghe-thuat')) return 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]';
    if (categorySlug.includes('tinh-nguyen')) return 'from-[#167C66] via-[#1E9E82] to-[#2DD4BF]';
    return 'from-[#142B49] via-[#1E3A5F] to-[#F3B846]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header (UIowa Engage Inspired) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#167C66] text-xs font-bold uppercase tracking-wider border border-emerald-200">
          <Compass size={14} weight="duotone" />
          <span>DANH BẠ TỔ CHỨC SINH VIÊN BAFU</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#142B49]">
          Khám Phá Câu Lạc Bộ Sinh Viên
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Tìm kiếm và kết nối với các câu lạc bộ học thuật, thể thao, nghệ thuật và tình nguyện. Tham gia hoạt động phong trào để trau dồi kỹ năng mềm và mở rộng mạng lưới bạn bè.
        </p>
      </div>

      {/* Discovery Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên câu lạc bộ, lĩnh vực hoặc từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#167C66] focus:bg-white transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Xóa từ khóa"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#167C66] hover:bg-[#115E4D] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <MagnifyingGlass size={18} weight="bold" />
            <span>Tìm kiếm</span>
          </button>
        </form>

        {/* Filter Pills & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-[#142B49] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({meta.total || clubs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#142B49] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Toggle Recruiting Only */}
          <button
            onClick={() => setOnlyRecruiting(!onlyRecruiting)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              onlyRecruiting
                ? 'bg-[#167C66] text-white border-[#167C66] shadow-2xs'
                : 'bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            <Flame size={16} weight={onlyRecruiting ? 'fill' : 'duotone'} className={onlyRecruiting ? 'text-white' : 'text-amber-500'} />
            <span>Chỉ xem CLB đang mở tuyển</span>
          </button>
        </div>
      </div>

      {/* Clubs Grid: 3 Cols Desktop, 2 Cols Tablet, 1 Col Mobile */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <EmptyState
          title="Không tìm thấy câu lạc bộ phù hợp"
          description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại các bộ lọc chuyên mục."
          actionLabel="Đặt lại bộ lọc"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isRecruiting = (club._count?.campaigns || 0) > 0;
            const gradient = getCoverGradient(club.category?.slug);
            return (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Cover Banner 16:9 */}
                  <div className={`h-36 bg-gradient-to-r ${gradient} relative flex items-start justify-end p-3.5`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-[#142B49] shadow-2xs">
                        {club.category?.name}
                      </span>
                      {isRecruiting && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs flex items-center gap-1">
                          <Flame size={12} weight="fill" />
                          Đang nhận đơn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Logo CLB chồng lên ranh giới cover/body */}
                  <div className="px-5 -mt-6 flex items-end justify-between">
                    <ClubLogo
                      name={club.name}
                      logoUrl={club.logoUrl}
                      categorySlug={club.category?.slug}
                      size="lg"
                      className="border-2 border-white shadow-sm"
                    />
                    <span className="text-xs text-slate-500 font-medium pb-1 flex items-center gap-1">
                      <UsersThree size={16} />
                      {club._count?.memberships || 0} hội viên
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 pt-3 space-y-3">
                    <h3 className="font-bold text-[#142B49] text-base leading-snug hover:text-[#167C66] transition-colors">
                      <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
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

                {/* Card Footer Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {club.email || 'Chính thức'}
                  </span>
                  <Link
                    to={`/clubs/${club.slug}`}
                    className="px-4 py-2 rounded-xl bg-[#142B49] hover:bg-[#167C66] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Xem chi tiết</span>
                    <CaretRight size={14} weight="bold" />
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
          <button
            disabled={meta.page <= 1}
            onClick={() => fetchClubs(meta.page - 1)}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <CaretLeft size={16} />
            <span>Trang trước</span>
          </button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            Trang {meta.page} / {meta.totalPages}
          </span>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchClubs(meta.page + 1)}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <span>Trang sau</span>
            <CaretRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
