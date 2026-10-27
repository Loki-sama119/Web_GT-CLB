import React from "react";
import {
  ArrowUpRight,
  MagnifyingGlass,
  ArrowRight,
} from "@phosphor-icons/react";
export default function CampusMasthead({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  stats,
  asset,
}) {
  return (
    <section className="campus-masthead editorial-container">
      <div className="masthead-dateline">
        <span>ĐỜI SỐNG SINH VIÊN / BAFU</span>
        <span>KẾT NỐI TỪ NHỮNG ĐIỀU BẠN YÊU</span>
      </div>
      <div className="masthead-grid">
        <div className="masthead-copy">
          <p className="eyebrow">
            <span className="square-mark" /> Cộng đồng bắt đầu từ bạn
          </p>
          <h1>
            TÌM MỘT NƠI
            <br />
            <span>THUỘC VỀ.</span>
          </h1>
          <p className="masthead-intro">
            Một sở thích chung. Một người bạn mới.
            <br />
            Khám phá những cộng đồng sinh viên tại Trường Đại học Nông – Lâm Bắc
            Giang.
          </p>
          <form
            className="editorial-search"
            onSubmit={onSearchSubmit}
            role="search"
          >
            <MagnifyingGlass size={22} />
            <input
              aria-label="Tìm câu lạc bộ"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Bạn đang tìm câu lạc bộ nào?"
            />
            <button type="submit" aria-label="Tìm kiếm">
              <ArrowRight size={24} />
            </button>
          </form>
          <a href="#kham-pha" className="editorial-cta">
            Khám phá câu lạc bộ <ArrowUpRight size={23} />
          </a>
        </div>
        <div className="masthead-aside">
          {asset ? (
            <figure className="campus-feature-photo">
              <img src={asset.url} alt={asset.altText} />
              <figcaption>
                <a
                  href={asset.sourcePostUrl || asset.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Nguồn tư liệu BAFU ↗
                </a>
              </figcaption>
            </figure>
          ) : (
            <div className="campus-type-poster">
              <div className="poster-edition">
                BAFU CAMPUS EDITORIAL <span>↗</span>
              </div>
              <div className="poster-type">
                HỌC.
                <br />
                GẶP GỠ.
                <br />
                <em>
                  TRƯỞNG
                  <br />
                  THÀNH.
                </em>
              </div>
              <div className="poster-caption">
                <span>Tư liệu hình ảnh đang cập nhật</span>
                <a href="https://bafu.edu.vn/" target="_blank" rel="noreferrer">
                  Ghé website trường ↗
                </a>
              </div>
            </div>
          )}
          <div className="masthead-note">
            <span className="note-number">↳</span>
            <p>
              Những kết nối bên ngoài giảng đường.
              <br />
              <strong>Mở ra một phần mới của chính bạn.</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="masthead-bottom">
        <span className="eyebrow">DANH MỤC TRÊN CỔNG</span>
        <div className="live-metric">
          <strong>{stats?.totalClubs ?? "—"}</strong>
          <span>CLB có nguồn xác minh</span>
        </div>
        <div className="live-metric">
          <strong>{stats?.totalCampaigns ?? "—"}</strong>
          <span>Đợt tuyển đang mở</span>
        </div>
        <div className="live-metric">
          <strong>{stats?.totalEvents ?? "—"}</strong>
          <span>Hoạt động có nguồn</span>
        </div>
      </div>
    </section>
  );
}
