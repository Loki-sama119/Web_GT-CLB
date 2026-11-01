import React from "react";
import { ArrowUpRight, MapPin } from "@phosphor-icons/react";
export default function EventPoster({
  event,
  onRegister,
  registering = false,
}) {
  if (!event) return null;
  const date = new Date(event.startTime),
    valid = !Number.isNaN(date.getTime());
  const past = valid && date < new Date();
  const canRegister =
    valid && !past && event.status === "UPCOMING" && onRegister;
  const parts = valid
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date)
    : "Đang cập nhật";
  return (
    <article className="event-poster">
      <div className="event-date">
        <time dateTime={event.startTime}>{parts}</time>
        <span>
          {event.status === "CANCELLED"
            ? "Đã hủy"
            : past
              ? "Đã diễn ra"
              : "Sắp diễn ra"}
        </span>
      </div>
      <div className="event-body">
        <p className="eyebrow">
          {event.organizer ||
            event.club?.name ||
            "Đơn vị tổ chức đang cập nhật"}
        </p>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-location">
          <MapPin size={18} />
          <span>{event.location || "Địa điểm đang cập nhật"}</span>
        </div>
        {event.datePrecision !== "DAY" && valid && (
          <p>
            {new Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Ho_Chi_Minh",
            }).format(date)}
          </p>
        )}
      </div>
      <div className="event-footer">
        {event.sourceUrl ? (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Đọc bài viết nguồn <ArrowUpRight size={19} />
          </a>
        ) : (
          <span>Nguồn đang cập nhật</span>
        )}
        {canRegister && (
          <button
            onClick={() => onRegister(event.id)}
            disabled={registering}
            className="editorial-cta"
          >
            {registering ? "Đang xử lý…" : "Đăng ký tham gia"}
          </button>
        )}
      </div>
    </article>
  );
}
