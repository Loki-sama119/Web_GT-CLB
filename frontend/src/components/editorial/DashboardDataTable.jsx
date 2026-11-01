import React from 'react';

/**
 * DashboardDataTable - Bảng dữ liệu mật độ cao chuẩn Functional Minimalism
 * Hỗ trợ thanh công cụ lọc, viền hairline border, cột thao tác ghim cố định
 */
export default function DashboardDataTable({
  title,
  toolbar = null,
  headers = [],
  children,
  emptyMessage = 'Không có dữ liệu',
  isEmpty = false
}) {
  return (
    <div className="bg-white border border-[#D8D5CD]">
      {/* Table Header & Toolbar */}
      {(title || toolbar) && (
        <div className="p-4 border-b border-[#D8D5CD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F0E7]">
          {title && (
            <h3 className="font-sans font-bold text-sm text-[#181C1B] uppercase tracking-wider">
              {title}
            </h3>
          )}
          {toolbar && <div className="shrink-0">{toolbar}</div>}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto min-w-full">
        {isEmpty ? (
          <div className="py-12 text-center text-xs text-[#7A827F] font-medium">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D8D5CD] bg-white text-[#575E5B] font-bold uppercase tracking-wider">
                {headers.map((h, idx) => (
                  <th key={idx} className={`py-3 px-4 ${h.className || ''}`}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D5CD]">
              {children}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
