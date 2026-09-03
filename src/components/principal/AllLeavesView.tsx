import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatDateString } from '../../utils/dateUtils';
import { LeaveApplication } from '../../types';
import { CheckCircle2, XCircle, FileText, Calendar, Search, Filter, Award, Download, RefreshCw } from 'lucide-react';
import { exportLeavesToPDF, exportLeavesToExcel } from '../../utils/exportUtils';

export const AllLeavesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { leaves, branches, principalProcessLeave } = useData();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSem, setSelectedSem] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Rejection modal
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter logic across ALL branches
  const filteredLeaves = leaves.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || l.branchId === selectedBranch;
    const matchesYear = selectedYear === 'all' || l.year === selectedYear;
    const matchesSem = selectedSem === 'all' || l.semester === selectedSem;
    const matchesSection = selectedSection === 'all' || l.section === selectedSection;
    const matchesType = selectedLeaveType === 'all' || l.leaveType === selectedLeaveType;
    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesYear && matchesSem && matchesSection && matchesType && matchesStatus;
  });

  const handleApprove = (leaveId: string) => {
    if (currentUser) {
      principalProcessLeave(leaveId, 'approve', currentUser);
    }
  };

  const handleOpenReject = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedLeave && currentUser && rejectionReason.trim()) {
      principalProcessLeave(selectedLeave.id, 'reject', currentUser, rejectionReason);
      setRejectModalOpen(false);
      setSelectedLeave(null);
      setRejectionReason('');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('all');
    setSelectedYear('all');
    setSelectedSem('all');
    setSelectedSection('all');
    setSelectedLeaveType('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">All Branch Leave Applications</h2>
          <p className="text-xs text-slate-300 mt-0.5">Principal Executive Portal • Final Approval Authority</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportLeavesToPDF(filteredLeaves, 'All_Branch_Leave_Report')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold transition-colors border border-white/10"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" /> Export PDF
          </button>
          <button
            onClick={() => exportLeavesToExcel(filteredLeaves, 'All_Branch_Leaves')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold transition-colors border border-white/10"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Excel
          </button>
        </div>
      </div>

      {/* Comprehensive Filter Controls */}
      <div className="bg-black/20 border border-white/15 p-3.5 sm:p-4 rounded-2xl space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter Applications
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-300 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search student or roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          {/* Sem */}
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Semesters</option>
            <option value="Semester 1">Sem 1</option>
            <option value="Semester 2">Sem 2</option>
            <option value="Semester 3">Sem 3</option>
            <option value="Semester 4">Sem 4</option>
            <option value="Semester 5">Sem 5</option>
            <option value="Semester 6">Sem 6</option>
          </select>

          {/* Leave Type */}
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="Medical">Medical</option>
            <option value="Casual">Casual</option>
            <option value="Duty Leave">Duty Leave</option>
            <option value="Emergency">Emergency</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending_principal">Pending Principal</option>
            <option value="pending_counsellor">Pending Counsellor</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-black/20 border border-white/15 p-8 sm:p-12 rounded-2xl text-center space-y-2 backdrop-blur-md">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto" />
          <p className="text-slate-200 font-semibold text-sm">No applications match your filter selection.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 hover:border-white/25 backdrop-blur-md transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm shrink-0 border border-amber-500/30">
                    {leave.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                      <span className="truncate">{leave.studentName}</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-200 font-semibold">
                        {leave.branchName}
                      </span>
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                      Roll: <span className="text-amber-300 font-semibold">{leave.rollNumber}</span> | Year:{' '}
                      {leave.year} ({leave.semester}-{leave.section})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                    {leave.leaveType}
                  </span>
                  <StatusBadge status={leave.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Leave Duration</p>
                  <p className="text-white font-bold mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    {formatDateString(leave.fromDate)} → {formatDateString(leave.toDate)}
                  </p>
                  <span className="text-[11px] text-amber-300 font-semibold mt-0.5 inline-block">
                    Total: {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Reason</p>
                  <p className="text-slate-200 mt-1 leading-relaxed">{leave.reason}</p>
                </div>
              </div>

              {/* Counsellor Recommendation Tag */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-300">
                  Ward Counsellor Status ({leave.counsellorName}):
                </span>
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
                    : 'Pending'}
                </span>
              </div>

              {/* Action Buttons if Pending Principal Approval */}
              {leave.status === 'pending_principal' && (
                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleOpenReject(leave)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject Request
                  </button>
                  <button
                    onClick={() => handleApprove(leave.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Grant Final Approval
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Principal Final Rejection"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Provide executive rejection reason for{' '}
            <span className="font-bold text-white">{selectedLeave?.studentName}</span> ({selectedLeave?.branchName}).
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Rejection Reason *
            </label>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Critical attendance shortage, insufficient documentation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors"
            >
              Confirm Final Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
