import React from 'react';
import { 
  CheckCircle, Clock, XCircle, WarningCircle, ArrowsCounterClockwise, CheckSquare, ShieldCheck, MinusCircle
} from '@phosphor-icons/react';

export const STATUS_PRESENTATION_MAP = {
  // Application statuses
  SUBMITTED: {
    label: 'Đã nộp đơn',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: CheckSquare,
    iconWeight: 'bold'
  },
  UNDER_REVIEW: {
    label: 'Đang xét duyệt',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    iconWeight: 'bold'
  },
  NEED_MORE_INFO: {
    label: 'Cần bổ sung',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: WarningCircle,
    iconWeight: 'bold'
  },
  ACCEPTED: {
    label: 'Đã trúng tuyển',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    iconWeight: 'fill'
  },
  REJECTED: {
    label: 'Không trúng tuyển',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    iconWeight: 'fill'
  },
  WITHDRAWN: {
    label: 'Đã rút đơn',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: ArrowsCounterClockwise,
    iconWeight: 'bold'
  },

  // Club & System Statuses
  ACTIVE: {
    label: 'Đang hoạt động',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: ShieldCheck,
    iconWeight: 'fill'
  },
  INACTIVE: {
    label: 'Tạm dừng hoạt động',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: MinusCircle,
    iconWeight: 'bold'
  },
  PENDING: {
    label: 'Chờ phê duyệt',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    iconWeight: 'bold'
  },

  // Roles
  LEADER: {
    label: 'Chủ nhiệm CLB',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  VICE_LEADER: {
    label: 'Phó chủ nhiệm CLB',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  MEMBER: {
    label: 'Hội viên chính thức',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  }
};

export function getStatusLabel(status) {
  if (!status) return 'Chưa xác định';
  return STATUS_PRESENTATION_MAP[status]?.label || status;
}

export function StatusBadge({ status, className = '' }) {
  const config = STATUS_PRESENTATION_MAP[status] || {
    label: status || 'N/A',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: null
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${config.badgeClass} ${className}`}
      data-status={status}
    >
      {IconComponent && <IconComponent size={14} weight={config.iconWeight || 'bold'} className="shrink-0" />}
      <span>{config.label}</span>
      {status && <span className="text-[10px] opacity-70 font-mono tracking-tight">({status})</span>}
    </span>
  );
}

export default StatusBadge;
