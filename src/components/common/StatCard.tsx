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
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-xl backdrop-blur-sm text-white relative overflow-hidden transition-all hover:border-white/20 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300 truncate">{title}</p>
          <h3 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-black text-white tracking-tight leading-none">{value}</h3>
          {subtitle && <p className="mt-0.5 text-[10px] text-slate-400 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${iconBgMap[color]}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};
