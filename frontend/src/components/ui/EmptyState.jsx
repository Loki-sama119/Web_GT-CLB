import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Không có dữ liệu',
  description = 'Chưa có thông tin phù hợp với yêu cầu tìm kiếm hoặc bộ lọc hiện tại.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
