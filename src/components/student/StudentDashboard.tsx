import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { formatDateString } from '../../utils/dateUtils';
import {
  FileText,
  Clock,
  CheckCircle2,
  PlusCircle,
  Calendar,
  GraduationCap,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const { studentProfile } = useAuth();
  const { leaves, counsellors } = useData();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (!studentProfile) return null;

  // Dynamic cross-reference for assigned branch Ward Counsellor
  const assignedCounsellor = counsellors.find((c) => c.branchId === studentProfile.branchId);

  const myLeaves = leaves.filter((l) => l.studentId === studentProfile.id);
  const pendingLeaves = myLeaves.filter((l) => l.status === 'pending_counsellor' || l.status === 'pending_principal');
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved');
  const totalLeaveDays = approvedLeaves.reduce((acc, curr) => acc + curr.numberOfDays, 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 2. Transparent Glass Welcome / Profile Header Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 sm:p-4.5 shadow-xl backdrop-blur-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300">
            <GraduationCap className="w-3.5 h-3.5" /> {studentProfile.branchName}
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight">Welcome, {studentProfile.studentName}</h2>
          <p className="text-[11px] sm:text-xs text-slate-300">
            Roll No: <span className="font-semibold text-white">{studentProfile.rollNumber}</span> • {studentProfile.year} ({studentProfile.semester}-{studentProfile.section})
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Apply For Leave
        </button>
      </div>

      {/* 3. Transparent Glass Ward Counsellor Card */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-xl backdrop-blur-sm text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {assignedCounsellor?.photoUrl ? (
            <img
              src={assignedCounsellor.photoUrl}
              alt={assignedCounsellor.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 text-sky-300 font-bold flex items-center justify-center text-base shrink-0 border border-white/15">
              {assignedCounsellor?.name?.charAt(0) || 'C'}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider block">ASSIGNED WARD COUNSELLOR</span>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{assignedCounsellor?.name || 'Dr. Ananya Reddy'}</h4>
            <p className="text-[11px] text-slate-300 truncate">{assignedCounsellor?.designation || 'Faculty Counsellor'}</p>
          </div>
        </div>

        {assignedCounsellor && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <span className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {assignedCounsellor.email}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {assignedCounsellor.mobile}
            </span>
          </div>
        )}
      </div>

      {/* 4. Transparent Glass Metric Cards (Total Applied, Pending, Approved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard
          title="TOTAL APPLIED"
          value={myLeaves.length}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="PENDING APPROVAL"
          value={pendingLeaves.length}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="APPROVED LEAVES"
          value={approvedLeaves.length}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="APPROVED DAYS"
          value={totalLeaveDays}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* 5. Transparent Glass Recent Requests Container */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-sm text-white space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Recent Leave Requests</h3>
            <p className="text-[11px] text-slate-300">Latest applications and real-time approval status</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            View All <span className="hidden sm:inline">History</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myLeaves.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-white/15 rounded-xl">
            <p className="text-xs text-slate-300">No leave applications submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {myLeaves.slice(0, 3).map((leave) => (
              <div key={leave.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{leave.leaveType}</span>
                    <span className="text-[11px] text-slate-300">({leave.numberOfDays} days)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {formatDateString(leave.fromDate)} → {formatDateString(leave.toDate)}
                  </p>
                </div>
                <div className="self-start sm:self-auto">
                  <StatusBadge status={leave.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
