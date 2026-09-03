import React from 'react';
import { LeaveStatus } from '../../types';
import { Clock, CheckCircle2, XCircle, ArrowRightCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: LeaveStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let badgeStyle = '';
  let icon = null;
  let label = '';

  switch (status) {
    case 'pending_counsellor':
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      icon = <Clock className="w-3.5 h-3.5 mr-1 animate-pulse text-amber-400" />;
      label = 'Pending Counsellor';
      break;
    case 'pending_principal':
      badgeStyle = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      icon = <ArrowRightCircle className="w-3.5 h-3.5 mr-1 animate-pulse text-indigo-400" />;
      label = 'Pending Principal';
      break;
    case 'approved':
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />;
      label = 'Approved';
      break;
    case 'rejected':
      badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      icon = <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />;
      label = 'Rejected';
      break;
    default:
      badgeStyle = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      label = status;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${padding} ${badgeStyle}`}>
      {icon}
      {label}
    </span>
  );
};
