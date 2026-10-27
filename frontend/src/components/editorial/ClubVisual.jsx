import React from "react";
import { clubIdentity } from "../../utils/clubIdentity";
export default function ClubVisual({ club, index = "01" }) {
  const identity = clubIdentity(club);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [club.coverUrl]);
  if (club.coverUrl && !failed)
    return (
      <figure className="club-visual">
        <img
          src={club.coverUrl}
          alt={`Ảnh hoạt động ${club.name}`}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      </figure>
    );
  return (
    <div
      className="club-visual type-visual"
      style={{ "--club-accent": identity.accent }}
    >
      <div className="visual-top">
        <span>{identity.label}</span>
        <span>{index.toString().padStart(2, "0")}</span>
      </div>
      <strong>{identity.word}</strong>
      <p>{identity.detail}</p>
      <span className="visual-caption">Ảnh hoạt động đang cập nhật</span>
    </div>
  );
}
