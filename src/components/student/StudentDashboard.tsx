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
      <div className="bg-slate-900/60 border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 drop-shadow-sm">
            <GraduationCap className="w-4 h-4" /> {studentProfile.branchName}
          </div>
          <h2 className="text-base sm:text-xl font-extrabold text-white leading-tight drop-shadow-md">Welcome, {studentProfile.studentName}</h2>
          <p className="text-xs text-slate-200 font-semibold drop-shadow-sm">
            Roll No: <span className="font-extrabold text-white">{studentProfile.rollNumber}</span> • {studentProfile.year} ({studentProfile.semester}-{studentProfile.section})
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-1.5 transition-all shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" /> Apply For Leave
        </button>
      </div>

      {/* 3. Transparent Glass Ward Counsellor Card */}
      <div className="bg-slate-900/60 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {assignedCounsellor?.photoUrl ? (
            <img
              src={assignedCounsellor.photoUrl}
              alt={assignedCounsellor.name}
              className="w-11 h-11 rounded-xl object-cover border border-white/30 shrink-0 shadow-md"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-indigo-600/30 text-sky-300 font-bold flex items-center justify-center text-lg shrink-0 border border-indigo-400/40">
              {assignedCounsellor?.name?.charAt(0) || 'C'}
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[11px] text-indigo-300 font-extrabold uppercase tracking-wider block drop-shadow-sm">ASSIGNED WARD COUNSELLOR</span>
            <h4 className="text-xs sm:text-sm font-extrabold text-white mt-0.5 truncate drop-shadow-sm">{assignedCounsellor?.name || 'Dr. Ananya Reddy'}</h4>
            <p className="text-xs text-slate-200 font-semibold truncate">{assignedCounsellor?.designation || 'Faculty Counsellor'}</p>
          </div>
        </div>

        {assignedCounsellor && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-slate-200 font-semibold w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15">
            <span className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-indigo-300 shrink-0" /> {assignedCounsellor.email}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Phone className="w-3.5 h-3.5 text-indigo-300 shrink-0" /> {assignedCounsellor.mobile}
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
      <div className="bg-slate-900/60 border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-white drop-shadow-sm">Recent Leave Requests</h3>
            <p className="text-xs text-slate-200 font-semibold">Latest applications and real-time approval status</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            View All <span className="hidden sm:inline">History</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myLeaves.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-white/20 rounded-xl">
            <p className="text-xs text-slate-200 font-semibold">No leave applications submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/15">
            {myLeaves.slice(0, 3).map((leave) => (
              <div key={leave.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white drop-shadow-sm">{leave.leaveType}</span>
                    <span className="text-xs text-indigo-200 font-bold">({leave.numberOfDays} days)</span>
                  </div>
                  <p className="text-xs text-slate-200 font-semibold">
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
