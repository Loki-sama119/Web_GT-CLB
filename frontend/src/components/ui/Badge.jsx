import React from 'react';

export default function Badge({
  children,
  variant = 'default', // default | success | warning | danger | info | campus | neutral
  size = 'md', // sm | md
  icon: Icon,
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-lg tracking-tight select-none border';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200/80',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-900 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
    info: 'bg-blue-50 text-blue-800 border-blue-200/80',
    campus: 'bg-[#167C66]/10 text-[#167C66] border-[#167C66]/20',
    navy: 'bg-[#142B49]/10 text-[#142B49] border-[#142B49]/20',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
