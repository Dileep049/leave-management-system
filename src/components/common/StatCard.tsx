import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo'
}) => {
  const iconBgMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
  };

  return (
    <div className="bg-slate-900/60 border border-white/20 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-white relative overflow-hidden transition-all hover:border-indigo-400/50 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 truncate drop-shadow-sm">{title}</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-200 font-semibold truncate">{subtitle}</p>}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${iconBgMap[color]} shadow-md`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};
