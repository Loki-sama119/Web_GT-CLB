import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, Filter, Users, Clock, Flame, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ClubsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const recruitingParam = searchParams.get('recruiting') === 'true';

  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Khám phá hơn 10+ Câu lạc bộ
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Danh Sách Câu Lạc Bộ Sinh Viên BAFU
          </h1>
          <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
            Tìm kiếm sân chơi phù hợp, nộp hồ sơ xét tuyển online và kết nối bạn bè cùng chung niềm đam mê tại trường Đại học Nông - Lâm Bắc Giang.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên câu lạc bộ, mô tả, từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả lĩnh vực
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Toggle Recruiting */}
          <button
            onClick={() => setOnlyRecruiting(!onlyRecruiting)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              onlyRecruiting
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyRecruiting ? 'fill-white' : 'text-orange-500 fill-orange-500'}`} />
            Chỉ xem CLB đang mở tuyển
          </button>
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy câu lạc bộ phù hợp</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn các bộ lọc lĩnh vực.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setOnlyRecruiting(false);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isRecruiting = (club._count?.campaigns || 0) > 0;
            return (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {club.name.charAt(4) || 'C'}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {club.category?.name}
                      </span>
                      {isRecruiting && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          Đang nhận đơn
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 hover:text-blue-600 transition-colors">
                    <Link to={`/clubs/${club.slug}`}>{club.name}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
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
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Xem chi tiết
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
            onClick={() => fetchClubs(meta.page - 1)}
            disabled={meta.page <= 1}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            Trang {meta.page} / {meta.totalPages}
          </span>
          <button
            onClick={() => fetchClubs(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
