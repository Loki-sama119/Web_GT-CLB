import React, { useState } from "react";
import { ImageSquare } from "@phosphor-icons/react";

export default function ClubLogo({
  logoUrl,
  name = "",
  clubName = "",
  size = "md",
  className = "",
}) {
  const [failed, setFailed] = useState(false);
  const targetName = name || clubName;

  const sizes = {
    sm: { box: "w-9 h-9", text: "text-[9px]", icon: 14 },
    md: { box: "w-12 h-12", text: "text-[10px]", icon: 18 },
    lg: { box: "w-16 h-16", text: "text-xs", icon: 22 },
    xl: { box: "w-20 h-20", text: "text-sm", icon: 28 },
  };

  const currentSize = sizes[size] || sizes.md;

  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={"Logo " + targetName}
        onError={() => setFailed(true)}
        className={`object-contain p-1 bg-white border border-[#D8D5CD] rounded-xl shadow-xs shrink-0 ${currentSize.box} ${className}`}
        loading="lazy"
      />
    );
  }

  // Fallback trung tính chuẩn xác thực: "Chờ logo"
  return (
    <div
      className={`rounded-xl bg-[#F4F1EA] border border-[#D8D5CD] text-[#7A827F] flex flex-col items-center justify-center shrink-0 select-none shadow-2xs ${currentSize.box} ${className}`}
      title={`Chưa có logo chính thức được cấp phép: ${targetName}`}
      aria-label={`Logo đang cập nhật: ${targetName}`}
    >
      <ImageSquare size={currentSize.icon} className="text-[#9CA3AF]" />
      <span className={`font-semibold tracking-tight text-center leading-none mt-0.5 ${currentSize.text}`}>
        Chờ logo
      </span>
    </div>
  );
}
