import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UsersThree } from '@phosphor-icons/react';
import ClubLogo from '../ui/ClubLogo';

/**
 * DirectoryRow - Dòng danh bạ câu lạc bộ phong cách Editorial Index
 * Thích hợp cho việc tra cứu nhanh danh sách nhiều câu lạc bộ
 */
export default function DirectoryRow({ club }) {
  if (!club) return null;

  const isRecruiting = club.campaigns && club.campaigns.length > 0;

  return (
    <div className="group py-4 px-4 sm:px-6 bg-white hover:bg-[#F4F0E7] border-b border-[#D8D5CD] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-4">
        <ClubLogo
          logoUrl={club.logoUrl}
          clubName={club.name}
          size="sm"
          className="rounded-none border border-[#D8D5CD] shrink-0"
        />
        <div>
          <h4 className="font-sans font-bold text-base text-[#181C1B] group-hover:text-[#12674D] transition-colors leading-snug">
            {club.name}
          </h4>
          <span className="text-xs text-[#575E5B] uppercase tracking-wider">
            {club.category?.name || 'Tổ chức BAFU'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
        <div className="flex items-center gap-1.5 text-[#575E5B]">
          <UsersThree size={15} />
          <span>{club._count?.members || 10}+ thành viên</span>
        </div>

        {isRecruiting ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#EF673F]/10 text-[#EF673F] font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 bg-[#EF673F] animate-pulse" />
            Đang tuyển
          </span>
        ) : (
          <span className="text-[#7A827F] uppercase tracking-wider text-[11px]">
            Thường kỳ
          </span>
        )}

        <Link
          to={`/clubs/${club.slug}`}
          className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-[#181C1B] hover:text-[#EF673F] transition-colors"
        >
          <span>Xem</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
