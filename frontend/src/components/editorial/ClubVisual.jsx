import React, { useState } from "react";
import { clubIdentity } from "../../utils/clubIdentity";
import ClubLogo from "../ui/ClubLogo";
import { ImageSquare } from "@phosphor-icons/react";

export default function ClubVisual({ club, index = "01" }) {
  const identity = clubIdentity(club);
  const [failed, setFailed] = useState(false);
  const displayIndex = index.toString().padStart(2, "0");

  const hasRealCover = club?.coverUrl && !failed;

  return (
    <figure
      className="club-visual relative overflow-hidden group select-none h-48 w-full bg-[#17211C] rounded-t-xl"
      style={{ "--club-accent": identity.accent }}
    >
      {hasRealCover ? (
        <img
          src={club.coverUrl}
          alt={`Hình ảnh ${club?.name}`}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${identity.gradient || "from-[#0F5132] to-[#16845A]"} flex flex-col justify-between p-4 relative overflow-hidden`}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12)_0%,transparent_60%)] pointer-events-none" />

          {/* Neutral update badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-white/90 text-[11px] font-semibold backdrop-blur-md border border-white/15">
              <ImageSquare size={13} />
              <span>Hình ảnh đang cập nhật</span>
            </span>
          </div>
        </div>
      )}

      {/* Top Badges: Category & Index */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white pointer-events-none z-10">
        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[#F8FAF7]">
          {club?.category?.name || identity.label}
        </span>
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[#E7B85B] font-extrabold tracking-widest">
          #{displayIndex}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <ClubLogo
            logoUrl={club?.logoUrl}
            name={club?.name}
            size="sm"
            className="ring-2 ring-white/30 shadow-md bg-white"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              BAFU CLUB
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-white drop-shadow-xs">
              {identity.word}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-white/20 text-white backdrop-blur-md border border-white/20 uppercase tracking-wider group-hover:bg-[#16845A] group-hover:text-white transition-colors">
          Khám phá ↗
        </span>
      </div>
    </figure>
  );
}
