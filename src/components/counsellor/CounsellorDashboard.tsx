import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Users, Clock, CheckCircle2, XCircle, ArrowRight, UserCheck } from 'lucide-react';

interface CounsellorDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const CounsellorDashboard: React.FC<CounsellorDashboardProps> = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { leaves, students, counsellors, counsellorProcessLeave } = useData();

  const assignedCounsellor = counsellors.find((c) => c.userId === currentUser?.id || c.email === currentUser?.email);
  const assignedBranchId = assignedCounsellor ? assignedCounsellor.branchId : currentUser?.branchId;

  // Filter students and leaves by assigned branch ONLY
  const branchStudents = students.filter((s) => s.branchId === assignedBranchId);
  const branchLeaves = leaves.filter((l) => l.branchId === assignedBranchId);

  const pendingLeaves = branchLeaves.filter((l) => l.status === 'pending_counsellor');
  const approvedLeaves = branchLeaves.filter((l) => l.status === 'approved' || l.status === 'pending_principal');
  const rejectedLeaves = branchLeaves.filter((l) => l.status === 'rejected');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="bg-black/20 border border-white/15 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            <UserCheck className="w-3.5 h-3.5" /> Ward Counsellor Dashboard
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">Welcome, {currentUser?.name}</h2>
          <p className="text-xs text-slate-300">
            Assigned Branch: <span className="font-semibold text-white">{assignedCounsellor?.branchName || 'Assigned Branch'}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('branch_leaves')}
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all backdrop-blur-sm shrink-0 w-full sm:w-auto"
        >
          Review Branch Leaves ({pendingLeaves.length})
        </button>
      </div>

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Branch Students"
          value={branchStudents.length}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Review"
          value={pendingLeaves.length}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved Leaves"
          value={approvedLeaves.length}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected Leaves"
          value={rejectedLeaves.length}
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Pending Applications Queue */}
      <div className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-6 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Pending Leave Requests</h3>
            <p className="text-xs text-slate-300">Applications awaiting your review</p>
          </div>
          <button
            onClick={() => setActiveTab('branch_leaves')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-white/15 rounded-xl">
            <p className="text-xs text-slate-300">All branch leave applications are reviewed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLeaves.map((leave) => (
              <div
                key={leave.id}
                className="p-3.5 bg-slate-950/60 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{leave.studentName}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Roll: {leave.rollNumber} • {leave.leaveType} ({leave.numberOfDays} days)
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5 italic max-w-lg">"{leave.reason}"</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => counsellorProcessLeave(leave.id, 'reject', currentUser!, 'Rejected by counsellor')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => counsellorProcessLeave(leave.id, 'approve', currentUser!)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Approve
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
