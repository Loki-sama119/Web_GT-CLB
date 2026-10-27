import React from 'react';

/**
 * BrandWordmark - Nhận diện dự án BAFU Club Portal
 * Thiết kế riêng biệt, độc bản dựa trên màu sắc và tinh thần Nông - Lâm Bắc Giang
 * Thay thế hoàn toàn icon mũ tốt nghiệp đại trà.
 */
export default function BrandWordmark({ variant = 'light', size = 'default', showSubtitle = true }) {
  const isDark = variant === 'dark';

  const emblemSizes = {
    small: 'w-8 h-8 text-base',
    default: 'w-10 h-10 text-lg',
    large: 'w-12 h-12 text-xl'
  };

  const titleSizes = {
    small: 'text-base',
    default: 'text-lg',
    large: 'text-xl'
  };

  const subSizes = {
    small: 'text-[10px]',
    default: 'text-[11px]',
    large: 'text-xs'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Biểu trưng độc bản: Mầm xanh vươn mình (Nông - Lâm) lồng trong khung Cổng kết nối (Portal) */}
      <div 
        className={`${emblemSizes[size] || emblemSizes.default} rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 shadow-xs`}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #167C66 0%, #142B49 100%)' 
            : 'linear-gradient(135deg, #142B49 0%, #167C66 100%)',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(20,43,73,0.1)'
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Vòm cổng kết nối (Portal Arch) */}
          <path 
            d="M6 26V14C6 8.47715 10.4772 4 16 4C21.5228 4 26 8.47715 26 14V26" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.9"
          />
          {/* Mầm lá nông nghiệp BAFU xanh non vươn lên */}
          <path 
            d="M16 26V12M16 12C16 12 11.5 13 11 17C10.5 21 16 23 16 23M16 12C16 12 20.5 13 21 17C21.5 21 16 23 16 23" 
            stroke="#F3B846" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Điểm nhấn hạt giống trí tuệ */}
          <circle cx="16" cy="8.5" r="2" fill="#F3B846" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-tight flex items-center gap-1.5 ${titleSizes[size] || titleSizes.default}`}>
          <span className={isDark ? 'text-white' : 'text-[#142B49]'}>BAFU</span>
          <span className="text-[#167C66] font-bold">ClubPortal</span>
        </div>
        {showSubtitle && (
          <div className={`${subSizes[size] || subSizes.default} font-medium tracking-tight ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Đại Học Nông - Lâm Bắc Giang
          </div>
        )}
      </div>
    </div>
  );
}
