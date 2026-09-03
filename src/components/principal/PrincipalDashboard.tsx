import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Award, Clock, CheckCircle2, XCircle, BarChart3, ArrowRight } from 'lucide-react';

interface PrincipalDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { leaves, principalProcessLeave } = useData();

  const totalApps = leaves.length;
  const pendingPrincipal = leaves.filter((l) => l.status === 'pending_principal');
  const approvedLeaves = leaves.filter((l) => l.status === 'approved');
  const rejectedLeaves = leaves.filter((l) => l.status === 'rejected');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="bg-black/20 border border-white/15 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Award className="w-3.5 h-3.5" /> Principal Executive Portal
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">Welcome, {currentUser?.name}</h2>
          <p className="text-xs text-slate-300">Final approval decision authority across all college branches</p>
        </div>

        <button
          onClick={() => setActiveTab('all_leaves')}
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white font-semibold text-xs shadow-md shadow-amber-600/20 transition-all backdrop-blur-sm shrink-0 w-full sm:w-auto"
        >
          Review Pending ({pendingPrincipal.length})
        </button>
      </div>

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Applications"
          value={totalApps}
          icon={BarChart3}
          color="indigo"
        />
        <StatCard
          title="Pending Approval"
          value={pendingPrincipal.length}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Final Approved"
          value={approvedLeaves.length}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected Applications"
          value={rejectedLeaves.length}
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Pending Approval Action Queue */}
      <div className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Pending Final Approval</h3>
            <p className="text-xs text-slate-300">Forwarded by Ward Counsellors for your decision</p>
          </div>
          <button
            onClick={() => setActiveTab('all_leaves')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors shrink-0"
          >
            View All <span className="hidden sm:inline">Applications</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingPrincipal.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-white/15 rounded-xl">
            <p className="text-xs text-slate-300">No applications pending your approval right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPrincipal.map((leave) => (
              <div
                key={leave.id}
                className="p-3.5 bg-slate-950/60 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{leave.studentName}</h4>
                    <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      {leave.branchName}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    Roll: {leave.rollNumber} • {leave.leaveType} ({leave.numberOfDays} days) • Approved by {leave.counsellorName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => principalProcessLeave(leave.id, 'reject', currentUser!, 'Rejected by Principal')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => principalProcessLeave(leave.id, 'approve', currentUser!)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Grant Approval
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
