import React from 'react';

/**
 * SectionIndex - Dấu chỉ mục chuyên mục phong cách Swiss Editorial
 * Ví dụ: "01 / KHÁM PHÁ CỘNG ĐỒNG"
 */
export default function SectionIndex({ index = '01', label = '', dark = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 py-1 text-xs uppercase tracking-[0.12em] font-bold ${
      dark ? 'text-[#D8D5CD]' : 'text-[#575E5B]'
    } ${className}`}>
      <span className={`font-display text-base font-bold tracking-normal ${
        dark ? 'text-[#EF673F]' : 'text-[#12674D]'
      }`}>
        {index}
      </span>
      <span className="w-6 h-[1px] bg-current opacity-40" />
      <span>{label}</span>
    </div>
  );
}
