import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ImageSquare, CheckCircle } from "@phosphor-icons/react";
import ClubLogo from "../ui/ClubLogo";
import { clubIdentity, activityLabel } from "../../utils/clubIdentity";

export default function EditorialClubCard({ club }) {
  const [failed, setFailed] = useState(false);
  if (!club) return null;
  const identity = clubIdentity(club);
  const hasCover = club.coverUrl && !failed;

  return (
    <article
      className="compact-club group overflow-hidden flex flex-col bg-white border border-[#D8D5CD] hover:border-[#16845A] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl"
      style={{ "--club-accent": identity.accent }}
    >
      {/* Top Banner Visual */}
      <Link
        to={"/clubs/" + club.slug}
        className="relative h-32 w-full overflow-hidden block bg-[#17211C]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {hasCover ? (
          <img
            src={club.coverUrl}
            alt={`Ảnh bìa ${club.name}`}
            onError={() => setFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${identity.gradient || "from-[#0F5132] to-[#16845A]"} flex items-center justify-center p-3 relative`}
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 text-white/90 text-[10px] font-semibold backdrop-blur-md border border-white/15">
              <ImageSquare size={12} />
              <span>Hình ảnh đang cập nhật</span>
            </span>
          </div>
        )}

        <div className="absolute top-2.5 left-3 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md border border-white/20">
            {club.category?.name || identity.label}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between -mt-9 mb-3 relative z-10">
            <ClubLogo
              logoUrl={club.logoUrl}
              name={club.name}
              size="md"
              className="ring-2 ring-white shadow-md bg-white shrink-0"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] bg-[#0F5132]/10 px-2 py-0.5 rounded border border-[#0F5132]/20 mt-4">
              {activityLabel(club)}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-[#17211C] leading-snug group-hover:text-[#0F5132] transition-colors">
            <Link to={"/clubs/" + club.slug}>{club.name}</Link>
          </h3>

          <p className="text-xs text-[#575E5B] line-clamp-2 mt-2 leading-relaxed">
            {club.shortDescription || "Hồ sơ câu lạc bộ sinh viên BAFU."}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-semibold flex items-center gap-1">
            <CheckCircle size={13} weight="fill" className="text-[#10B981]" />
            <span>
              {club.dataClassification === "REAL_VERIFIED"
                ? "Có nguồn xác minh"
                : "Đang cập nhật"}
            </span>
          </span>
          <Link
            to={"/clubs/" + club.slug}
            className="font-bold text-[#0F5132] hover:text-[#16845A] inline-flex items-center gap-1 transition-colors"
          >
            Khám phá <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </article>
  );
}
