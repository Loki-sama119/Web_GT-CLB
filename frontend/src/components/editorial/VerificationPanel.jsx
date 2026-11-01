import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
const labels = {
  REAL_VERIFIED: "Có nguồn xác minh",
  REAL_UNVERIFIED: "Chờ xác minh",
  DEMO: "Minh họa · đã cách ly",
  E2E_TEST: "Kiểm thử · đã cách ly",
  PLACEHOLDER: "Nội dung tạm",
  UNKNOWN: "Chưa rõ nguồn",
};
export default function VerificationPanel() {
  const [data, setData] = useState(null),
    [kind, setKind] = useState("clubs"),
    [filter, setFilter] = useState(""),
    [selected, setSelected] = useState(null),
    [source, setSource] = useState(""),
    [evidence, setEvidence] = useState(""),
    [classification, setClassification] = useState("REAL_UNVERIFIED"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const load = () =>
    api
      .getVerificationQueue()
      .then((r) => setData(r.data))
      .catch((e) => setMessage(e.message));
  useEffect(() => {
    load();
  }, []);
  const rows = (data?.[kind] || []).filter(
    (r) => !filter || r.dataClassification === filter,
  );
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api.verifyContent(kind, selected.id, {
        dataClassification: classification,
        sourceUrl: source,
        evidence,
      });
      setSelected(null);
      setEvidence("");
      await load();
      setMessage("Đã lưu phân loại và nhật ký xác minh.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl">Xác minh dữ liệu & tư liệu</h2>
        <p className="text-sm mt-3 text-slate-600">
          Đối chiếu bài viết nguồn và chủ thể trước khi công bố. Dữ liệu chưa rõ
          nguồn được giữ lại để kiểm tra.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          aria-label="Loại nội dung"
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            setSelected(null);
          }}
          className="border p-3 text-sm"
        >
          <option value="clubs">Câu lạc bộ</option>
          <option value="events">Sự kiện</option>
          <option value="campaigns">Đợt tuyển</option>
        </select>
        <select
          aria-label="Phân loại dữ liệu"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-3 text-sm"
        >
          <option value="">Tất cả phân loại</option>
          {Object.entries(labels).map(([v, l]) => (
            <option value={v} key={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      {message && (
        <p role="status" className="p-4 border bg-white text-sm">
          {message}
        </p>
      )}
      {!data ? (
        <p>Đang tải hàng đợi…</p>
      ) : (
        <div className="overflow-x-auto border bg-white">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-4">Nội dung</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4">Bài viết nguồn</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-4 min-w-48">{row.name || row.title}</td>
                  <td className="p-4 min-w-40">
                    {labels[row.dataClassification]}
                  </td>
                  <td className="p-4">
                    {row.sourceUrl ? (
                      <a
                        className="underline"
                        target="_blank"
                        rel="noreferrer"
                        href={row.sourceUrl}
                      >
                        Xem nguồn ↗
                      </a>
                    ) : (
                      "Chưa có"
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      className="underline cursor-pointer"
                      onClick={() => {
                        setSelected(row);
                        setSource(row.sourceUrl || "");
                        setClassification(row.dataClassification);
                        setEvidence("");
                      }}
                    >
                      Kiểm tra
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="p-6">Không có bản ghi phù hợp.</p>
          )}
        </div>
      )}
      {selected && (
        <form onSubmit={save} className="p-6 border bg-white space-y-4">
          <h3 className="text-xl">{selected.name || selected.title}</h3>
          <label className="block text-sm">
            Phân loại
            <select
              className="block border p-3 w-full mt-2"
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
            >
              {Object.entries(labels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            URL bài viết nguồn
            <input
              type="url"
              required={classification === "REAL_VERIFIED"}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="block border p-3 w-full mt-2"
            />
          </label>
          <label className="block text-sm">
            Bằng chứng đối chiếu
            <textarea
              required
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="block border p-3 w-full mt-2"
              placeholder="Ghi phần nội dung trong nguồn xác nhận đúng tổ chức, ngày diễn ra và đơn vị tổ chức."
            />
          </label>
          <div className="flex gap-4">
            <button type="submit" disabled={busy} className="editorial-cta">
              {busy ? "Đang lưu…" : "Lưu kết quả xác minh"}
            </button>
            <button type="button" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </form>
      )}
      {data && (
        <div className="border bg-white p-6">
          <h3 className="text-xl">Tài nguyên hình ảnh</h3>
          <p className="text-sm mt-3 text-slate-600">
            {data.assets.length} tài nguyên trong sổ nguồn. Ảnh chỉ được công bố
            sau khi xác minh chủ thể và ghi bằng chứng quyền sử dụng qua quy
            trình duyệt media.
          </p>
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-3">Tệp</th>
                  <th className="p-3">Nguồn</th>
                  <th className="p-3">Quyền sử dụng</th>
                  <th className="p-3">Xác minh</th>
                </tr>
              </thead>
              <tbody>
                {data.assets.map((a) => (
                  <tr key={a.assetId} className="border-t">
                    <td className="p-3">{a.filename}</td>
                    <td className="p-3">
                      {a.sourceUrl ? (
                        <a
                          href={a.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Xem nguồn ↗
                        </a>
                      ) : (
                        "Chưa có"
                      )}
                    </td>
                    <td className="p-3">
                      {a.usagePermission === "APPROVED"
                        ? "Được cấp quyền"
                        : "Chờ xác nhận"}
                    </td>
                    <td className="p-3">
                      {a.verificationStatus === "VERIFIED_APPROVED"
                        ? "Được duyệt"
                        : "Chưa được duyệt"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
