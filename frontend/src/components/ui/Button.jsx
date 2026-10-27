import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // primary (navy) | success (green) | secondary | outline | danger | ghost
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#142B49] text-white hover:bg-[#0E1F35] focus:ring-[#142B49] shadow-xs hover:shadow-md hover:shadow-[#142B49]/15',
    success: 'bg-[#167C66] text-white hover:bg-[#115E4D] focus:ring-[#167C66] shadow-xs hover:shadow-md hover:shadow-[#167C66]/20',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-200 shadow-2xs',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-xs',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
