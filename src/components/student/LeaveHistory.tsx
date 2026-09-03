import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateString } from '../../utils/dateUtils';
import { FileText, Calendar, Clock, Paperclip, AlertCircle, Search, Filter } from 'lucide-react';

export const LeaveHistory: React.FC = () => {
  const { studentProfile } = useAuth();
  const { leaves } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!studentProfile) return null;

  const myLeaves = leaves.filter((l) => l.studentId === studentProfile.id);

  const filteredLeaves = myLeaves.filter((l) => {
    const matchesSearch =
      l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">My Leave History</h2>
          <p className="text-xs text-slate-300 mt-0.5">Track all your submitted leave requests and approval status</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by leave type or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending_counsellor">Pending Counsellor</option>
          <option value="pending_principal">Pending Principal</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Leave List / Table */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-black/20 border border-white/15 p-8 sm:p-12 rounded-2xl text-center space-y-3 backdrop-blur-md">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto" />
          <p className="text-slate-200 font-semibold text-sm">No leave records found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't submitted any leave applications matching your search filters yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 hover:border-white/25 backdrop-blur-md transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    {leave.leaveType}
                  </span>
                  <StatusBadge status={leave.status} />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  Applied on {formatDateString(leave.appliedDate)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Leave Duration</p>
                  <p className="text-white font-bold mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    {formatDateString(leave.fromDate)} → {formatDateString(leave.toDate)}
                  </p>
                  <span className="text-[11px] text-indigo-300 font-semibold mt-0.5 inline-block">
                    Total: {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Reason</p>
                  <p className="text-slate-200 mt-1 leading-relaxed">{leave.reason}</p>
                </div>
              </div>

              {/* Counsellor & Principal Tracking Progress */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Ward Counsellor Status:</span>
                  <p className="text-slate-200 font-medium mt-0.5">
                    {leave.counsellorName || 'Assigned Counsellor'}:{' '}
                    <span
                      className={
                        leave.counsellorStatus === 'approved'
                          ? 'text-emerald-400 font-bold'
                          : leave.counsellorStatus === 'rejected'
                          ? 'text-rose-400 font-bold'
                          : 'text-amber-400 font-bold'
                      }
                    >
                      {leave.counsellorStatus === 'approved'
                        ? 'Approved ✓'
                        : leave.counsellorStatus === 'rejected'
                        ? 'Rejected ✗'
                        : 'Pending Review'}
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Principal Final Decision:</span>
                  <p className="text-slate-200 font-medium mt-0.5">
                    {leave.principalStatus === 'approved' ? (
                      <span className="text-emerald-400 font-bold">Approved ✓</span>
                    ) : leave.principalStatus === 'rejected' ? (
                      <span className="text-rose-400 font-bold">Rejected ✗</span>
                    ) : (
                      <span className="text-slate-400 italic">Awaiting Principal</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Rejection alert if applicable */}
              {leave.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Rejection Reason: </span>
                    {leave.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
