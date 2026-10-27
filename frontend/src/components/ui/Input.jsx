import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    required = false,
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 tracking-tight">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-xl border bg-white py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#167C66] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
              : 'border-slate-200/90 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

export default Input;
