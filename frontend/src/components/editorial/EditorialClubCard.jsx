import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import ClubLogo from "../ui/ClubLogo";
import { clubIdentity } from "../../utils/clubIdentity";
export default function EditorialClubCard({ club }) {
  if (!club) return null;
  const identity = clubIdentity(club);
  return (
    <article
      className="compact-club"
      style={{ "--club-accent": identity.accent }}
    >
      <div className="card-kicker">
        <span>{identity.label}</span>
        <ArrowUpRight size={20} />
      </div>
      <ClubLogo logoUrl={club.logoUrl} name={club.name} />
      <h3>
        <Link to={"/clubs/" + club.slug}>{club.name}</Link>
      </h3>
      <p>{club.shortDescription || "Thông tin đang cập nhật."}</p>
      <div className="card-bottom">
        <span>
          {club.dataClassification === "REAL_VERIFIED"
            ? "Có nguồn xác minh"
            : "Đang cập nhật"}
        </span>
        <Link to={"/clubs/" + club.slug}>Khám phá ↗</Link>
      </div>
    </article>
  );
}
