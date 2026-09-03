import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  FileText,
  BarChart3,
  User,
  PlusCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { role } = useAuth();

  let menuItems: { id: string; label: string; icon: any }[] = [];

  if (role === 'admin') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Student Accounts', icon: Users },
      { id: 'counsellors', label: 'Ward Counsellors', icon: UserCheck },
      { id: 'branches', label: 'Branches', icon: Building2 },
      { id: 'leaves', label: 'All Leave Applications', icon: FileText },
      { id: 'reports', label: 'Monthly Reports', icon: BarChart3 }
    ];
  } else if (role === 'student') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'profile', label: 'My Academic Profile', icon: User },
      { id: 'apply', label: 'Apply Leave', icon: PlusCircle },
      { id: 'history', label: 'My Leave History', icon: Clock }
    ];
  } else if (role === 'ward_counsellor') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'counsellor_profile', label: 'My Profile & Photo', icon: User },
      { id: 'branch_leaves', label: 'Branch Leave Requests', icon: FileText },
      { id: 'reports', label: 'Branch Reports', icon: BarChart3 }
    ];
  } else if (role === 'principal') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'all_counsellors', label: 'Branch Counsellors', icon: UserCheck },
      { id: 'all_leaves', label: 'All Branch Applications', icon: FileText },
      { id: 'reports', label: 'Monthly Reports', icon: BarChart3 }
    ];
  }

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-16 lg:top-0 bottom-0 left-0 w-64 bg-slate-950/90 lg:bg-white/[0.02] border-r border-white/10 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto shrink-0 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between px-3 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Main Menu
            </p>
            <button 
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'apply' && (activeTab === 'apply-leave' || activeTab === 'apply_leave'));
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 backdrop-blur-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isActive ? 'block' : 'hidden'}`} />
              </button>
            );
          })}
        </div>

        {/* Footer Info Box */}
        <div className="p-4 m-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
          <p className="text-[11px] font-bold text-white">KBN College</p>
          <p className="text-[10px] text-slate-300 mt-0.5">Automated Branch Routing Active</p>
        </div>
      </aside>
    </>
  );
};
