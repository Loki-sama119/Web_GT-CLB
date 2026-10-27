import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UsersThree } from '@phosphor-icons/react';
import ClubLogo from '../ui/ClubLogo';

/**
 * EditorialClubCard - Thẻ câu lạc bộ chuẩn Swiss Editorial (Span 4/12 hoặc 3/12)
 * Bố cục tối giản, đường kẻ hairline border, typography rõ ràng, không đổ bóng mờ
 */
export default function EditorialClubCard({ club }) {
  if (!club) return null;

  const isRecruiting = club.campaigns && club.campaigns.length > 0;

  return (
    <div className="group bg-white border border-[#D8D5CD] p-6 flex flex-col justify-between hover:border-[#181C1B] transition-colors relative">
      {/* Top Header: Category & Recruitment indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D5CD] text-xs">
          <span className="uppercase tracking-[0.1em] font-bold text-[#12674D]">
            {club.category?.name || 'Tổ chức BAFU'}
          </span>
          {isRecruiting ? (
            <span className="inline-flex items-center gap-1.5 text-[#EF673F] font-bold text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#EF673F] animate-pulse" />
              Đang tuyển
            </span>
          ) : (
            <span className="text-[#7A827F] text-[11px] uppercase tracking-wider">
              Thường kỳ
            </span>
          )}
        </div>

        {/* Club Logo & Name */}
        <div className="flex items-start gap-3.5 pt-1">
          <ClubLogo
            logoUrl={club.logoUrl}
            clubName={club.name}
            size="md"
            className="rounded-none border border-[#D8D5CD] shrink-0"
          />
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-lg text-[#181C1B] group-hover:text-[#12674D] transition-colors leading-snug">
              {club.name}
            </h3>
            <div className="text-xs text-[#575E5B] flex items-center gap-1">
              <UsersThree size={14} />
              <span>{club._count?.members || 15}+ thành viên</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#575E5B] line-clamp-2 leading-relaxed pt-1">
          {club.description || 'Tham gia giao lưu, học tập và rèn luyện kỹ năng cùng các thành viên năng động.'}
        </p>
      </div>

      {/* Footer Action */}
      <div className="pt-4 mt-6 border-t border-[#D8D5CD] flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-[#7A827F] font-semibold">
          {club.meetingSchedule ? 'Có lịch cố định' : 'Sinh hoạt định kỳ'}
        </span>
        <Link
          to={`/clubs/${club.slug}`}
          className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#181C1B] hover:text-[#EF673F] transition-colors"
        >
          <span>Xem chi tiết</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
