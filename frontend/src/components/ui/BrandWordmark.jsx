import React from "react";
export default function BrandWordmark({
  variant = "light",
  size = "default",
  showSubtitle = true,
}) {
  return (
    <div
      className={
        "portal-wordmark wordmark-" +
        size +
        " " +
        (variant === "dark" ? "on-dark" : "")
      }
    >
      <span className="wordmark-name">
        BAFU<span className="wordmark-dot">.</span>
      </span>
      <span className="wordmark-rule" />
      <span className="wordmark-descriptor">
        CAMPUS CLUBS
        {showSubtitle && <small>Dự án cổng thông tin sinh viên</small>}
      </span>
    </div>
  );
}
