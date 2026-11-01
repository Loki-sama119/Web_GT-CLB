import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import ClubVisual from "./ClubVisual";
import ClubLogo from "../ui/ClubLogo";
import { clubIdentity, activityLabel } from "../../utils/clubIdentity";

export default function FeatureClubTile({ club, index = 1 }) {
  if (!club) return null;
  const identity = clubIdentity(club);

  return (
    <article
      className="feature-club bg-white border border-[#D8D5CD] hover:border-[#16845A] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
      style={{ "--club-accent": identity.accent }}
    >
      <Link to={"/clubs/" + club.slug} aria-label={"Khám phá " + club.name}>
        <ClubVisual club={club} index={index} />
      </Link>
      <div className="feature-club-body p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#16845A] uppercase tracking-wider">
              {club.category?.name || identity.label}
            </span>
            <span className="source-status inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
              <CheckCircle size={13} weight="fill" className="text-[#10B981]" />
              {club.dataClassification === "REAL_VERIFIED"
                ? "Có nguồn xác minh"
                : "Đang cập nhật"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ClubLogo logoUrl={club.logoUrl} name={club.name} size="md" />
            <h3 className="font-display font-bold text-xl text-[#17211C] leading-tight hover:text-[#0F5132] transition-colors">
              <Link to={"/clubs/" + club.slug}>{club.name}</Link>
            </h3>
          </div>

          <p className="text-sm text-[#575E5B] leading-relaxed line-clamp-3">
            {club.shortDescription || club.description || "Thông tin giới thiệu đang cập nhật từ nguồn chính thức."}
          </p>
        </div>

        <div className="pt-5 mt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">
            {activityLabel(club)}
          </span>
          <Link
            to={"/clubs/" + club.slug}
            aria-label={"Chi tiết " + club.name}
            className="inline-flex items-center gap-1 font-bold text-[#0F5132] hover:text-[#16845A] transition-colors"
          >
            <span>Chi tiết</span>
            <ArrowUpRight size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </article>
  );
}
