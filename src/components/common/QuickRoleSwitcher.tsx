import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, GraduationCap, UserCheck, Award } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { role, switchDemoRole } = useAuth();

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'admin', label: 'Admin', icon: Shield, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'ward_counsellor', label: 'Ward Counsellor', icon: UserCheck, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { id: 'principal', label: 'Principal', icon: Award, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="font-semibold text-slate-300">Live Role Preview Switcher:</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => switchDemoRole(r.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                isActive
                  ? `${r.color} shadow-lg ring-1 ring-white/20`
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {r.label}
              {isActive && <span className="ml-1 text-[10px] uppercase font-bold text-emerald-400">• Active</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
