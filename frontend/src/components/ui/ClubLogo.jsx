import React from "react";
import { ImageSquare } from "@phosphor-icons/react";
export default function ClubLogo({
  logoUrl,
  name = "",
  clubName = "",
  size = "md",
  className = "",
}) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [logoUrl]);
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };
  if (logoUrl && !failed)
    return (
      <img
        src={logoUrl}
        alt={"Logo " + (name || clubName)}
        onError={() => setFailed(true)}
        className={
          "object-contain p-1 bg-white border border-[#D8D5CD] shrink-0 " +
          (sizes[size] || sizes.md) +
          " " +
          className
        }
      />
    );
  return (
    <div
      className={"logo-pending " + (sizes[size] || sizes.md) + " " + className}
      role="img"
      aria-label={"Chưa có logo được duyệt: " + (name || clubName)}
      title="Logo đang cập nhật"
    >
      <ImageSquare size={20} />
      <span>Chờ logo</span>
    </div>
  );
}
