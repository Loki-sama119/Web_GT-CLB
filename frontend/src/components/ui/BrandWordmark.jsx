import React from "react";

export default function BrandWordmark({
  variant = "light",
  size = "default",
  showSubtitle = true,
}) {
  const isDark = variant === "dark";
  const sizeMap = {
    sm: { text: "text-lg", sub: "text-[9px]", gap: "gap-2" },
    default: { text: "text-2xl", sub: "text-[10px]", gap: "gap-2.5" },
    lg: { text: "text-3xl", sub: "text-xs", gap: "gap-3" },
  };
  const currentSize = sizeMap[size] || sizeMap.default;

  return (
    <div
      className={`portal-wordmark flex items-center ${currentSize.gap} select-none ${
        isDark ? "on-dark text-white" : "text-[#181C1B]"
      }`}
    >
      {/* Biểu trưng chữ BAFU thiết kế dạng typographic brandmark */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#0F5132] text-white flex items-center justify-center font-black text-xs tracking-wider shadow-xs">
          BF
        </div>
        <span
          className={`font-sans font-black tracking-tight ${currentSize.text} leading-none text-[#0F5132]`}
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
            className={`${currentSize.sub} font-semibold uppercase tracking-wider text-[#16845A] leading-tight`}
          >
            Cổng thông tin sinh viên
          </span>
        )}
      </div>
    </div>
  );
}
