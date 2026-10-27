import React from 'react';
import SectionIndex from './SectionIndex';

/**
 * EditorialHeading - Tiêu đề phong cách báo chí Thụy Sĩ (Swiss Typographic)
 * Sử dụng font Oswald cho tiêu đề và Plus Jakarta Sans cho phụ đề
 */
export default function EditorialHeading({
  index,
  eyebrow,
  title,
  subtitle,
  dark = false,
  action = null,
  className = '',
  size = 'default', // 'hero' | 'default' | 'compact'
  as: Component = 'h2'
}) {
  const titleSizes = {
    hero: 'text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-[-0.02em]',
    default: 'text-3xl sm:text-4xl lg:text-[46px] leading-[1.08] tracking-[-0.015em]',
    compact: 'text-2xl sm:text-3xl lg:text-[34px] leading-[1.12]'
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Eyebrow hoặc Section Index */}
      {(index || eyebrow) && (
        <div className="flex items-center justify-between">
          {index ? (
            <SectionIndex index={index} label={eyebrow} dark={dark} />
          ) : (
            <span className={`text-xs font-bold uppercase tracking-[0.12em] ${dark ? 'text-[#EF673F]' : 'text-[#12674D]'}`}>
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {/* Main Heading & Action (nếu có) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <Component className={`font-display font-bold uppercase ${titleSizes[size] || titleSizes.default} ${
          dark ? 'text-white' : 'text-[#181C1B]'
        }`}>
          {title}
        </Component>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-normal ${
          dark ? 'text-[#D8D5CD]' : 'text-[#575E5B]'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
