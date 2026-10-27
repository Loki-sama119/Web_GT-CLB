import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UsersThree, Clock, Sparkle } from '@phosphor-icons/react';
import ClubLogo from '../ui/ClubLogo';

/**
 * FeatureClubTile - Thẻ câu lạc bộ nổi bật khổ lớn (Span 6/12)
 * Bố cục biên tập: Ảnh cover lớn, thông tin chi tiết, trạng thái tuyển và logo chính xác
 */
export default function FeatureClubTile({ club }) {
  if (!club) return null;

  const isRecruiting = club.campaigns && club.campaigns.length > 0;

  return (
    <article className="group bg-white border border-[#D8D5CD] flex flex-col justify-between hover:border-[#181C1B] transition-colors relative">
      {/* Cover Image & Category Banner */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#181C1B] border-b border-[#D8D5CD]">
        {club.coverUrl ? (
          <img
            src={club.coverUrl}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#12674D] to-[#181C1B] flex items-center justify-center p-6 text-white/20">
            <span className="font-display text-4xl uppercase tracking-widest">{club.name}</span>
          </div>
        )}

        {/* Trạng thái tuyển thành viên */}
        <div className="absolute top-4 left-4">
          {isRecruiting ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EF673F] text-white text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-white animate-pulse" />
              Đang tuyển thành viên
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 bg-white/90 text-[#181C1B] text-xs font-semibold uppercase tracking-wider">
              Hoạt động thường kỳ
            </span>
          )}
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 right-4 bg-[#181C1B]/80 text-white text-xs px-2.5 py-0.5 uppercase tracking-wider font-semibold">
          {club.category?.name || 'Câu lạc bộ BAFU'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-4 grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ClubLogo
              logoUrl={club.logoUrl}
              clubName={club.name}
              size="md"
              className="rounded-none border border-[#D8D5CD]"
            />
            <div>
              <span className="text-[11px] uppercase tracking-[0.12em] text-[#575E5B] font-semibold block">
                {club.category?.name || 'Tổ chức sinh viên'}
              </span>
              <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#181C1B] group-hover:text-[#12674D] transition-colors leading-snug">
                {club.name}
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#575E5B] leading-relaxed line-clamp-3">
            {club.description || 'Câu lạc bộ hoạt động tích cực trong phong trào học tập, văn hóa và phong trào sinh viên BAFU.'}
          </p>
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-4 border-t border-[#D8D5CD] flex items-center justify-between text-xs text-[#575E5B]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-[#181C1B]">
              <UsersThree size={16} />
              {club._count?.members || 20}+ thành viên
            </span>
          </div>

          <Link
            to={`/clubs/${club.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#181C1B] hover:text-[#EF673F] transition-colors uppercase tracking-wider"
          >
            <span>Chi tiết</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
