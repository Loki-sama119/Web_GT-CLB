import React from 'react';
import { MapPin, Clock, ArrowRight } from '@phosphor-icons/react';

/**
 * EventPoster - Áp phích sự kiện phong cách Swiss Poster Design
 * Điểm nhấn ngày tháng kích thước lớn bằng font Oswald, thông tin súc tích
 */
export default function EventPoster({
  event,
  featured = false,
  onRegister,
  registering = false
}) {
  if (!event) return null;

  // Format date
  const eventDate = new Date(event.startDate || Date.now());
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = `THÁNG ${(eventDate.getMonth() + 1).toString().padStart(2, '0')}`;
  const year = eventDate.getFullYear();

  return (
    <article className={`group bg-white border border-[#D8D5CD] hover:border-[#181C1B] transition-colors flex flex-col justify-between ${
      featured ? 'lg:col-span-6' : 'lg:col-span-3 sm:col-span-6 col-span-12'
    }`}>
      {/* Top Header: Date Block + Poster Visual */}
      <div>
        <div className="p-6 border-b border-[#D8D5CD] flex items-start justify-between bg-[#F4F0E7]">
          {/* Khối Ngày Tháng Lớn font Oswald */}
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-5xl sm:text-6xl text-[#181C1B] leading-none">
              {day}
            </span>
            <div className="flex flex-col text-[11px] font-bold uppercase tracking-wider text-[#12674D]">
              <span>{month}</span>
              <span className="text-[#7A827F]">{year}</span>
            </div>
          </div>

          <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#181C1B] text-white font-semibold">
            {event.category || 'Hoạt động'}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#12674D]">
            {event.club?.name || 'Ban Tổ Chức BAFU'}
          </div>

          <h3 className={`font-sans font-bold text-[#181C1B] group-hover:text-[#12674D] transition-colors leading-snug ${
            featured ? 'text-2xl' : 'text-lg'
          }`}>
            {event.title}
          </h3>

          <div className="space-y-1.5 text-xs text-[#575E5B] pt-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#EF673F] shrink-0" />
              <span className="font-medium">{event.location || 'Hội trường A1 - BAFU'}</span>
            </div>
            {event.startTime && (
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#575E5B] shrink-0" />
                <span>{event.startTime}</span>
              </div>
            )}
          </div>

          {featured && event.description && (
            <p className="text-sm text-[#575E5B] line-clamp-2 pt-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onRegister && onRegister(event.id)}
          disabled={registering}
          className="w-full py-2.5 px-4 bg-[#181C1B] hover:bg-[#12674D] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{registering ? 'Đang xử lý...' : 'Đăng ký tham gia'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}
