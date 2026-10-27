import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ArrowUpRight } from "@phosphor-icons/react";
import CampusMasthead from "../../components/editorial/CampusMasthead";
import FeatureClubTile from "../../components/editorial/FeatureClubTile";
import EditorialClubCard from "../../components/editorial/EditorialClubCard";
import DirectoryRow from "../../components/editorial/DirectoryRow";
import EventPoster from "../../components/editorial/EventPoster";
function Heading({ number, title, note, link, to }) {
  return (
    <div className="editorial-section-heading">
      <span className="section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
      {link && (
        <Link to={to} className="text-link">
          {link}
          <ArrowUpRight size={20} />
        </Link>
      )}
    </div>
  );
}
export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null),
    [clubs, setClubs] = useState([]),
    [recruiting, setRecruiting] = useState([]),
    [events, setEvents] = useState([]),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [asset, setAsset] = useState(null);
  useEffect(() => {
    let current = true;
    (async () => {
      try {
        const [s, c, r, e, a] = await Promise.all([
          api.getStatsOverview(),
          api.getClubs({ limit: 12 }),
          api.getClubs({ recruiting: "true", limit: 4 }),
          api.getEvents({ limit: 6 }),
          api.getCampusAssets(),
        ]);
        if (current) {
          setStats(s.data);
          setClubs(c.data.clubs);
          setRecruiting(r.data.clubs);
          setEvents(e.data.events);
          setAsset(a.data?.assets?.[0] || null);
        }
      } catch {
        if (current)
          setError("Chưa tải được dữ liệu. Vui lòng tải lại trang để thử lại.");
      } finally {
        if (current) setLoading(false);
      }
    })();
    return () => {
      current = false;
    };
  }, []);
  const upcoming = events.filter(
    (e) => new Date(e.startTime) > new Date() && e.status === "UPCOMING",
  );
  const past = events.filter(
    (e) => new Date(e.startTime) < new Date() && e.status !== "CANCELLED",
  );
  return (
    <div className="editorial-page">
      <CampusMasthead
        searchQuery={search}
        onSearchChange={setSearch}
        onSearchSubmit={(e) => {
          e.preventDefault();
          navigate("/clubs?search=" + encodeURIComponent(search.trim()));
        }}
        stats={stats}
        asset={asset}
      />
      {error && (
        <p role="alert" className="editorial-container data-notice">
          {error}
        </p>
      )}
      <section id="kham-pha" className="editorial-section editorial-container">
        <Heading
          number="01"
          title="Bạn muốn bắt đầu từ đâu?"
          note="Những cộng đồng được ghi nhận trong nguồn tin về BAFU."
          link="Khám phá tất cả"
          to="/clubs"
        />
        {loading ? (
          <p role="status">Đang tải danh mục…</p>
        ) : clubs.length ? (
          <>
            <div className="featured-grid">
              {clubs.slice(0, 2).map((c, i) => (
                <FeatureClubTile key={c.id} club={c} index={i + 1} />
              ))}
            </div>
            <div className="compact-grid">
              {clubs.slice(2, 5).map((c) => (
                <EditorialClubCard key={c.id} club={c} />
              ))}
            </div>
          </>
        ) : (
          <p className="editorial-empty">
            Danh mục đang được cập nhật từ các nguồn xác minh.
          </p>
        )}
      </section>
      <section className="recruitment-section">
        <div className="editorial-container editorial-section">
          <Heading
            number="02"
            title="Một bước để cùng nhau."
            note="Các đợt tuyển thành viên đã được xác minh và đang mở."
            link="Tra cứu đợt tuyển"
            to="/clubs?recruiting=true"
          />
          {recruiting.length ? (
            <div className="compact-grid">
              {recruiting.map((c) => (
                <EditorialClubCard key={c.id} club={c} />
              ))}
            </div>
          ) : (
            <div className="recruitment-empty">
              <span className="empty-symbol">↗</span>
              <div>
                <h3>Chờ một lời mời phù hợp.</h3>
                <p>
                  {loading
                    ? "Đang tải thông tin tuyển thành viên…"
                    : "Chưa có đợt tuyển được xác minh đang mở. Bạn vẫn có thể tìm hiểu các CLB trong danh bạ."}
                </p>
              </div>
              <Link to="/clubs" className="text-link">
                Xem danh bạ <ArrowUpRight size={22} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="editorial-container editorial-section">
        <Heading
          number="03"
          title="Hẹn gặp ở hoạt động tiếp theo."
          note="Lịch mới được tách riêng với tư liệu hoạt động đã diễn ra."
          link="Xem lịch sự kiện"
          to="/events"
        />
        {upcoming.length ? (
          <div className="event-grid">
            {upcoming.map((e) => (
              <EventPoster
                key={e.id}
                event={e}
                onRegister={() => navigate("/events")}
              />
            ))}
          </div>
        ) : (
          <p className="editorial-empty">
            {loading
              ? "Đang tải lịch sự kiện…"
              : "Chưa có sự kiện sắp diễn ra được xác minh. Lịch mới sẽ xuất hiện tại đây khi được công bố."}
          </p>
        )}
      </section>
      <section className="editorial-container editorial-section directory-section">
        <Heading
          number="04"
          title="Danh bạ câu lạc bộ."
          note="Tên tổ chức, lĩnh vực và bài viết nguồn trong cùng một nơi."
        />
        {clubs.map((c, i) => (
          <DirectoryRow key={c.id} club={c} index={i} />
        ))}
      </section>
      <section className="editorial-container editorial-section">
        <Heading
          number="05"
          title="Những dấu chân đã để lại."
          note="Tư liệu lịch sử giữ nguyên ngày diễn ra, có liên kết bài viết nguồn."
        />
        {past.length ? (
          <div className="event-grid">
            {past.map((e) => (
              <EventPoster key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="editorial-empty">
            Tư liệu hoạt động đang được cập nhật.
          </p>
        )}
      </section>
    </div>
  );
}
