import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import CampusMasthead from '../../components/editorial/CampusMasthead';
import EditorialHeading from '../../components/editorial/EditorialHeading';
import FeatureClubTile from '../../components/editorial/FeatureClubTile';
import EditorialClubCard from '../../components/editorial/EditorialClubCard';
import EventPoster from '../../components/editorial/EventPoster';
import DirectoryRow from '../../components/editorial/DirectoryRow';
import { ArrowRight, Compass, Sparkle, CalendarDots } from '@phosphor-icons/react';

export default function EditorialHomePrototype() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalClubs: 10, totalMembers: 56, totalEvents: 5 });
  const [recruitingClubs, setRecruitingClubs] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, recRes, allRes, evRes] = await Promise.all([
          api.getStatsOverview().catch(() => null),
          api.getClubs({ recruiting: 'true', limit: 4 }).catch(() => null),
          api.getClubs({ limit: 8 }).catch(() => null),
          api.getEvents({ limit: 3 }).catch(() => null)
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (recRes?.data?.clubs) setRecruitingClubs(recRes.data.clubs);
        if (allRes?.data?.clubs) setAllClubs(allRes.data.clubs);
        if (evRes?.data?.events) setEvents(evRes.data.events);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clubs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/clubs');
    }
  };

  return (
    <div className="bg-[#F4F0E7] text-[#181C1B] min-h-screen">
      {/* 1. CAMPUS MASTHEAD (HERO) */}
      <CampusMasthead
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        stats={stats}
      />

      {/* 2. SECTION 01 — CÂU LẠC BỘ ĐANG MỞ TUYỂN (ASYMMETRIC BENTO GRID) */}
      <section className="py-20 lg:py-28 border-b border-[#D8D5CD] bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialHeading
            index="01"
            eyebrow="Đang mở đợt tuyển quân"
            title="Gia nhập câu lạc bộ"
            subtitle="Nộp hồ sơ trực tuyến vào các đơn vị đang tuyển thành viên gen mới tại BAFU."
            action={
              <Link
                to="/clubs?recruiting=true"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF673F] hover:text-[#D9532B] transition-colors"
              >
                <span>Xem tất cả đợt tuyển</span>
                <ArrowRight size={14} />
              </Link>
            }
            className="mb-12"
          />

          {/* Bento Grid: 2 Thẻ lớn dẫn đầu (span 6), tiếp theo là thẻ span 3 hoặc 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {recruitingClubs.slice(0, 2).map((club) => (
              <div key={club.id} className="lg:col-span-6">
                <FeatureClubTile club={club} />
              </div>
            ))}
          </div>

          {recruitingClubs.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {recruitingClubs.slice(2, 5).map((club) => (
                <EditorialClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SECTION 02 — SỰ KIỆN NỔI BẬT (SWISS EVENT POSTERS ON FOREST BACKGROUND) */}
      <section className="py-20 lg:py-28 bg-[#12674D] text-white border-b border-[#D8D5CD]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialHeading
            index="02"
            eyebrow="Lịch hoạt động & phong trào"
            title="Sự kiện sắp diễn ra"
            subtitle="Workshop học thuật, giải đấu thể thao và chiến dịch tình nguyện trong khuôn viên trường."
            dark={true}
            action={
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EF673F] hover:text-white transition-colors"
              >
                <span>Xem toàn bộ lịch</span>
                <ArrowRight size={14} />
              </Link>
            }
            className="mb-12"
          />

          {/* Event Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            {events.length > 0 ? (
              events.map((ev, idx) => (
                <EventPoster
                  key={ev.id}
                  event={ev}
                  featured={idx === 0}
                  onRegister={(id) => navigate('/events')}
                />
              ))
            ) : (
              <div className="col-span-12 p-12 text-center border border-white/20 text-white/70">
                Chưa có sự kiện mới được công bố.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SECTION 03 — DANH BẠ TỔ CHỨC SINH VIÊN (DIRECTORY ROWS) */}
      <section className="py-20 lg:py-28 bg-[#F4F0E7]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialHeading
            index="03"
            eyebrow="Khám phá toàn diện"
            title="Danh bạ câu lạc bộ"
            subtitle="Tra cứu nhanh thông tin, lĩnh vực hoạt động và số lượng thành viên của từng tổ chức."
            action={
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#181C1B] hover:text-[#12674D] transition-colors"
              >
                <span>Mở thư viện danh mục</span>
                <ArrowRight size={14} />
              </Link>
            }
            className="mb-12"
          />

          {/* Directory Rows List */}
          <div className="border-t border-[#D8D5CD]">
            {allClubs.slice(0, 6).map((club) => (
              <DirectoryRow key={club.id} club={club} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/clubs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#181C1B] hover:bg-[#12674D] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Xem đầy đủ {stats.totalClubs} câu lạc bộ BAFU</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
