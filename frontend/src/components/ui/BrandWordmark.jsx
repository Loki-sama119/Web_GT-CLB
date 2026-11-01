import React from "react";

export default function BrandWordmark({
  variant = "light",
  size = "default",
  showSubtitle = true,
}) {
  const isDark = variant === "dark";
  const sizeMap = {
    sm: { text: "text-lg", sub: "text-[9px]", gap: "gap-2", logo: "w-7 h-7" },
    small: { text: "text-lg", sub: "text-[9px]", gap: "gap-2", logo: "w-7 h-7" },
    default: { text: "text-2xl", sub: "text-[10px]", gap: "gap-2.5", logo: "w-9 h-9" },
    lg: { text: "text-3xl", sub: "text-xs", gap: "gap-3", logo: "w-11 h-11" },
  };
  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div
      className={`portal-wordmark flex items-center ${currentSize.gap} select-none ${
        isDark ? "on-dark text-white" : "text-[#181C1B]"
      }`}
    >
      {/* Biểu trưng Logo BAFU chính thức kết hợp chữ thương hiệu */}
      <div className="flex items-center gap-2">
        <img
          src="/images/bafu/logo-bafu-official.png"
          alt="Logo Trường Đại học Nông - Lâm Bắc Giang"
          className={`${currentSize.logo} object-contain shrink-0 ${
            isDark ? "bg-white/95 rounded-full p-0.5 shadow-xs" : ""
          }`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback-bf");
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div
          className="logo-fallback-bf hidden w-8 h-8 rounded-lg bg-[#0F5132] text-white items-center justify-center font-black text-xs tracking-wider shadow-xs"
        >
          BF
        </div>
        <span
          className={`font-sans font-black tracking-tight ${currentSize.text} leading-none ${
            isDark ? "text-white" : "text-[#0F5132]"
          }`}
        >
          BAFU<span className="text-[#E7B85B]">.</span>
        </span>
      </div>

      <div className="hidden sm:block w-[1.5px] h-6 bg-[#D8D5CD] shrink-0" />

      <div className="hidden sm:flex flex-col justify-center">
        <span
          className={`font-sans font-extrabold tracking-wider uppercase text-[11px] leading-tight ${
            isDark ? "text-white" : "text-[#181C1B]"
          }`}
        >
          CAMPUS CLUBS
        </span>
        {showSubtitle && (
          <span
            className={`${currentSize.sub} font-semibold uppercase tracking-wider ${
              isDark ? "text-emerald-400" : "text-[#16845A]"
            } leading-tight`}
          >
            Cổng thông tin sinh viên
          </span>
        )}
      </div>
    </div>
  );
}
