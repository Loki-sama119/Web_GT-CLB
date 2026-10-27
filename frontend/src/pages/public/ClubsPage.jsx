import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import EditorialHeading from '../../components/editorial/EditorialHeading';
import FeatureClubTile from '../../components/editorial/FeatureClubTile';
import EditorialClubCard from '../../components/editorial/EditorialClubCard';
import DirectoryRow from '../../components/editorial/DirectoryRow';
import { MagnifyingGlass, CaretLeft, CaretRight, SquaresFour, Rows } from '@phosphor-icons/react';

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'rows'

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
    <div className="bg-[#F4F0E7] text-[#181C1B] min-h-screen py-12 lg:py-20 font-sans">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Masthead Header */}
        <div className="border-b border-[#D8D5CD] pb-8 space-y-4">
          <EditorialHeading
            as="h1"
            index="01"
            eyebrow="Thư mục tổ chức chính thức"
            title="Khám phá câu lạc bộ"
            subtitle="Danh mục toàn bộ các câu lạc bộ, đội, nhóm học thuật, kỹ năng, thể thao và tình nguyện BAFU."
          />

          {/* Search Toolbar & Quick Filter Bar */}
          <div className="pt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex border border-[#181C1B] bg-white max-w-md w-full">
              <div className="flex items-center px-3 py-2.5 grow">
                <MagnifyingGlass size={18} className="text-[#575E5B] mr-2 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên câu lạc bộ..."
                  className="w-full text-xs text-[#181C1B] placeholder-[#7A827F] bg-transparent focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#181C1B] hover:bg-[#12674D] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
              >
                Tìm kiếm
              </button>
            </form>

            {/* View Mode & Recruitment Filter */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOnlyRecruiting(!onlyRecruiting)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-2 cursor-pointer ${
                  onlyRecruiting
                    ? 'bg-[#EF673F] text-white border-[#EF673F]'
                    : 'bg-white text-[#181C1B] border-[#D8D5CD] hover:border-[#181C1B]'
                }`}
              >
                <span className={`w-2 h-2 ${onlyRecruiting ? 'bg-white' : 'bg-[#EF673F]'} animate-pulse`} />
                <span>Đang tuyển</span>
              </button>

              <div className="flex items-center border border-[#D8D5CD] bg-white divide-x divide-[#D8D5CD]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#181C1B] text-white' : 'text-[#575E5B] hover:text-[#181C1B]'}`}
                  title="Xem dạng lưới modular"
                >
                  <SquaresFour size={18} />
                </button>
                <button
                  onClick={() => setViewMode('rows')}
                  className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'rows' ? 'bg-[#181C1B] text-white' : 'text-[#575E5B] hover:text-[#181C1B]'}`}
                  title="Xem dạng danh sách dòng"
                >
                  <Rows size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Editorial Category Navigation Bar */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 transition-colors uppercase tracking-wider cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-[#181C1B] text-white font-bold'
                  : 'bg-white border border-[#D8D5CD] text-[#575E5B] hover:text-[#181C1B]'
              }`}
            >
              Tất cả ({meta.total || clubs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 transition-colors uppercase tracking-wider cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#181C1B] text-white font-bold'
                    : 'bg-white border border-[#D8D5CD] text-[#575E5B] hover:text-[#181C1B]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Modular Bento Grid or Directory Rows */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white border border-[#D8D5CD] animate-pulse" />
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="bg-white border border-[#D8D5CD] p-12 text-center space-y-4">
            <div className="font-display text-2xl uppercase font-bold text-[#181C1B]">
              Không tìm thấy câu lạc bộ phù hợp
            </div>
            <p className="text-xs text-[#575E5B]">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc danh mục.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#181C1B] text-white text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              Xóa toàn bộ bộ lọc
            </button>
          </div>
        ) : viewMode === 'rows' ? (
          <div className="bg-white border border-[#D8D5CD]">
            {clubs.map((club) => (
              <DirectoryRow key={club.id} club={club} />
            ))}
          </div>
        ) : (
          /* Modular Bento Layout */
          <div className="space-y-6">
            {/* Top 2 Featured Clubs (Span 6/12) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {clubs.slice(0, 2).map((club) => (
                <div key={club.id} className="lg:col-span-6">
                  <FeatureClubTile club={club} />
                </div>
              ))}
            </div>

            {/* Remaining Clubs (Span 4/12 or 3/12) */}
            {clubs.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.slice(2).map((club) => (
                  <EditorialClubCard key={club.id} club={club} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="pt-8 border-t border-[#D8D5CD] flex items-center justify-between text-xs font-semibold">
            <div className="text-[#575E5B]">
              Trang {meta.page} / {meta.totalPages} • Tổng số {meta.total} tổ chức
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchClubs(meta.page - 1)}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 bg-white border border-[#D8D5CD] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <CaretLeft size={14} />
                <span>Trước</span>
              </button>
              <button
                onClick={() => fetchClubs(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="px-3 py-1.5 bg-white border border-[#D8D5CD] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>Sau</span>
                <CaretRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
