import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Menu, LogOut, Building, Shield, UserCheck, Award, GraduationCap } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', icon: Shield, bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'ward_counsellor':
        return { label: 'Ward Counsellor', icon: UserCheck, bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'principal':
        return { label: 'Principal', icon: Award, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'student':
      default:
        return { label: 'Student', icon: GraduationCap, bg: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="h-16 bg-[#141419]/80 border-b border-white/15 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md shrink-0 shadow-md">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Drawer"
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-white text-sm sm:text-base tracking-tight leading-none truncate">
              KBN College
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5 truncate">
              STUDENT LEAVE MANAGEMENT
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badge.bg}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          {badge.label}
        </div>

        <NotificationCenter />

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
