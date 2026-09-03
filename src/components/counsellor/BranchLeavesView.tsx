import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { formatDateString } from '../../utils/dateUtils';
import { LeaveApplication } from '../../types';
import { CheckCircle2, XCircle, FileText, Calendar, Search, Filter, AlertCircle, ExternalLink } from 'lucide-react';

export const BranchLeavesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { leaves, counsellors, counsellorProcessLeave } = useData();

  // Find counsellor's assigned branch
  const assignedCounsellor = counsellors.find((c) => c.userId === currentUser?.id || c.email === currentUser?.email);
  const assignedBranchId = assignedCounsellor ? assignedCounsellor.branchId : currentUser?.branchId;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected leave for action or details modal
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // STRICT REQUIREMENT: Ward Counsellors must ONLY see leave applications from students belonging to their assigned branch
  const branchLeaves = leaves.filter((l) => l.branchId === assignedBranchId);

  const filteredLeaves = branchLeaves.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (leaveId: string) => {
    if (currentUser) {
      counsellorProcessLeave(leaveId, 'approve', currentUser);
      if (selectedLeave?.id === leaveId) setSelectedLeave(null);
    }
  };

  const handleOpenReject = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedLeave && currentUser && rejectionReason.trim()) {
      counsellorProcessLeave(selectedLeave.id, 'reject', currentUser, rejectionReason);
      setRejectModalOpen(false);
      setSelectedLeave(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Branch Leave Applications</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Managing leave requests for assigned branch:{' '}
            <span className="font-bold text-indigo-300">{assignedCounsellor?.branchName || 'Assigned Branch'}</span>
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or reason..."
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
          <option value="pending_counsellor">Pending My Review</option>
          <option value="pending_principal">Pending Principal</option>
          <option value="approved">Final Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Leaves list */}
      {filteredLeaves.length === 0 ? (
        <div className="bg-black/20 border border-white/15 p-8 sm:p-12 rounded-2xl text-center space-y-2 backdrop-blur-md">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto" />
          <p className="text-slate-200 font-semibold text-sm">No leave applications found for your branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 hover:border-white/25 backdrop-blur-md transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">
                    {leave.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{leave.studentName}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                      Roll: <span className="text-indigo-300 font-semibold">{leave.rollNumber}</span> | Year:{' '}
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

              {/* Action Buttons for Pending Ward Counsellor requests */}
              {leave.status === 'pending_counsellor' && (
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
                    <CheckCircle2 className="w-4 h-4" /> Approve & Forward to Principal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Application"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Please enter a detailed rejection reason for{' '}
            <span className="font-bold text-white">{selectedLeave?.studentName}</span>. This reason will be sent to the student.
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
              placeholder="e.g. Mandatory lab exams scheduled, attendance shortage..."
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
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
