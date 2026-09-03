import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Shield, Users, UserCheck, Building2, FileText, ArrowRight, UserPlus } from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { students, counsellors, branches, leaves } = useData();

  const pendingLeaves = leaves.filter((l) => l.status === 'pending_counsellor' || l.status === 'pending_principal');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="bg-black/20 border border-white/15 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <Shield className="w-3.5 h-3.5 text-rose-400" /> System Administrator
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">Welcome, {currentUser?.name}</h2>
          <p className="text-xs text-slate-300">Manage user accounts, college branches, and ward counsellor assignments</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all backdrop-blur-sm"
          >
            <UserPlus className="w-4 h-4" /> Manage Students
          </button>
          <button
            onClick={() => setActiveTab('counsellors')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            Assign Counsellors
          </button>
        </div>
      </div>

      {/* Key Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Student Accounts"
          value={students.length}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Ward Counsellors"
          value={counsellors.length}
          icon={UserCheck}
          color="sky"
        />
        <StatCard
          title="Active Branches"
          value={branches.length}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Total Applications"
          value={leaves.length}
          subtitle={`${pendingLeaves.length} pending`}
          icon={FileText}
          color="amber"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-black/20 border border-white/15 p-4 sm:p-5 rounded-2xl space-y-2 hover:border-white/25 transition-all backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/30">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Student Accounts</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provision student profiles with complete academic details.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 pt-2 transition-colors self-start"
          >
            Manage Accounts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-black/20 border border-white/15 p-4 sm:p-5 rounded-2xl space-y-2 hover:border-white/25 transition-all backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold border border-sky-500/30">
              <UserCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Branch Counsellors</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Assign Ward Counsellors to college branches for automated leave routing.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('counsellors')}
            className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 pt-2 transition-colors self-start"
          >
            Manage Assignments <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-black/20 border border-white/15 p-4 sm:p-5 rounded-2xl space-y-2 hover:border-white/25 transition-all backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold border border-purple-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">College Branches</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Configure academic branches and department details.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('branches')}
            className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 pt-2 transition-colors self-start"
          >
            View Branches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
