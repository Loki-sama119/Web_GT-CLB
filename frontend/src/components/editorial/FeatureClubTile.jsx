import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import ClubVisual from "./ClubVisual";
import ClubLogo from "../ui/ClubLogo";
import { clubIdentity } from "../../utils/clubIdentity";
export default function FeatureClubTile({ club, index = 1 }) {
  if (!club) return null;
  const identity = clubIdentity(club);
  return (
    <article
      className="feature-club"
      style={{ "--club-accent": identity.accent }}
    >
      <Link to={"/clubs/" + club.slug} aria-label={"Khám phá " + club.name}>
        <ClubVisual club={club} index={index} />
      </Link>
      <div className="feature-club-body">
        <div className="card-kicker">
          <span>{club.category?.name}</span>
          <span className="source-status">
            {club.dataClassification === "REAL_VERIFIED"
              ? "Có nguồn xác minh"
              : "Thông tin đang cập nhật"}
          </span>
        </div>
        <div className="club-title-line">
          <ClubLogo logoUrl={club.logoUrl} name={club.name} />
          <h3>
            <Link to={"/clubs/" + club.slug}>{club.name}</Link>
          </h3>
        </div>
        <p>{club.shortDescription || "Thông tin giới thiệu đang cập nhật."}</p>
        <div className="card-bottom">
          <span>
            {club._count?.campaigns > 0
              ? "Đang tuyển thành viên"
              : "Thông tin tuyển: đang cập nhật"}
          </span>
          <Link to={"/clubs/" + club.slug} aria-label={"Chi tiết " + club.name}>
            <ArrowUpRight size={25} />
          </Link>
        </div>
      </div>
    </article>
  );
}
