import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import ClubLogo from "../ui/ClubLogo";
export default function DirectoryRow({ club, index }) {
  if (!club) return null;
  return (
    <div className="directory-row">
      <span className="directory-index">
        {index != null ? String(index + 1).padStart(2, "0") : "↳"}
      </span>
      <ClubLogo logoUrl={club.logoUrl} name={club.name} size="sm" />
      <div className="directory-name">
        <h3>
          <Link to={"/clubs/" + club.slug}>{club.name}</Link>
        </h3>
        <span>{club.category?.name}</span>
      </div>
      <span className="directory-status">
        {club.dataClassification === "REAL_VERIFIED"
          ? "Có nguồn xác minh"
          : "Thông tin đang cập nhật"}
      </span>
      <Link to={"/clubs/" + club.slug} aria-label={"Xem " + club.name}>
        <ArrowUpRight size={25} />
      </Link>
    </div>
  );
}
