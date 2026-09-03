import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateString, getMonthNameString, getCurrentMonthString } from '../../utils/dateUtils';
import { exportLeavesToPDF, exportLeavesToExcel } from '../../utils/exportUtils';
import { BarChart3, Download, Calendar, Filter, Building2, FileSpreadsheet, FileText } from 'lucide-react';

export const MonthlyReportsView: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { leaves, branches, counsellors } = useData();

  // Find counsellor branch if applicable
  const assignedCounsellor = counsellors.find((c) => c.userId === currentUser?.id || c.email === currentUser?.email);
  const counsellorBranchId = assignedCounsellor ? assignedCounsellor.branchId : currentUser?.branchId;

  // Selected Month (default to current month e.g. "2026-09")
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>('2026-09');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(
    role === 'ward_counsellor' && counsellorBranchId ? counsellorBranchId : 'all'
  );

  // Filter leaves strictly for role
  let roleAccessibleLeaves = leaves;
  if (role === 'ward_counsellor' && counsellorBranchId) {
    roleAccessibleLeaves = leaves.filter((l) => l.branchId === counsellorBranchId);
  }

  // Filter by selected month
  const monthlyLeaves = roleAccessibleLeaves.filter((l) => {
    if (!l.appliedDate) return false;
    const leaveMonthYear = l.appliedDate.substring(0, 7); // e.g. "2026-09"
    const matchesMonth = leaveMonthYear === selectedMonthYear;
    const matchesBranch = selectedBranchFilter === 'all' || l.branchId === selectedBranchFilter;
    return matchesMonth && matchesBranch;
  });

  // Calculate metrics
  const totalApps = monthlyLeaves.length;
  const approvedLeaves = monthlyLeaves.filter((l) => l.status === 'approved');
  const rejectedLeaves = monthlyLeaves.filter((l) => l.status === 'rejected');
  const pendingLeaves = monthlyLeaves.filter((l) => l.status === 'pending_counsellor' || l.status === 'pending_principal');
  const totalDays = approvedLeaves.reduce((acc, curr) => acc + curr.numberOfDays, 0);

  // Branch-wise summary statistics
  const branchSummary = branches
    .filter((b) => (role === 'ward_counsellor' && counsellorBranchId ? b.id === counsellorBranchId : true))
    .map((b) => {
      const count = monthlyLeaves.filter((l) => l.branchId === b.id).length;
      return {
        branchName: b.name,
        code: b.code,
        count
      };
    });

  const monthLabel = getMonthNameString(selectedMonthYear);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Monthly Leave Reports</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            College Official Academic Reports • {monthLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportLeavesToPDF(monthlyLeaves, `${monthLabel}_Leave_Report`, 'Official College Records')}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all backdrop-blur-sm"
          >
            <FileText className="w-4 h-4 shrink-0" /> Download PDF
          </button>
          <button
            onClick={() => exportLeavesToExcel(monthlyLeaves, `${selectedMonthYear}_leave_report`)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all backdrop-blur-sm"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" /> Download Excel
          </button>
        </div>
      </div>

      {/* Month & Branch Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Report Month</label>
          <input
            type="month"
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {role !== 'ward_counsellor' && (
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Filter by Branch</label>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-slate-300 font-bold uppercase">Total Applications</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{totalApps}</h4>
        </div>
        <div className="bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-emerald-400 font-bold uppercase">Approved Leaves</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">{approvedLeaves.length}</h4>
        </div>
        <div className="bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-amber-400 font-bold uppercase">Pending Leaves</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">{pendingLeaves.length}</h4>
        </div>
        <div className="bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-rose-400 font-bold uppercase">Rejected Leaves</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1">{rejectedLeaves.length}</h4>
        </div>
        <div className="bg-black/20 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-purple-400 font-bold uppercase">Total Leave Days</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-purple-300 mt-1">{totalDays}</h4>
        </div>
      </div>

      {/* Branch-wise Distribution List */}
      <div className="bg-black/20 border border-white/15 p-4 sm:p-5 rounded-2xl space-y-3 backdrop-blur-md">
        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" /> Branch-Wise Application Breakdown ({monthLabel})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {branchSummary.map((b, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-white/10 p-3 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 font-medium truncate">{b.branchName}</span>
              <span className="font-extrabold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 shrink-0">
                {b.count} leaves
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Monthly Report Table */}
      <div className="bg-black/20 border border-white/15 rounded-2xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5 backdrop-blur-md">
        <h4 className="text-xs sm:text-sm font-bold text-white">Detailed Monthly Leave Records</h4>
        <div className="overflow-x-auto min-w-[800px]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-300 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Class</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Days</th>
                <th className="p-3">Counsellor</th>
                <th className="p-3">Principal</th>
                <th className="p-3">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {monthlyLeaves.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    No leave records logged for {monthLabel}.
                  </td>
                </tr>
              ) : (
                monthlyLeaves.map((l, index) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{index + 1}</td>
                    <td className="p-3 font-bold text-white">{l.studentName}</td>
                    <td className="p-3 font-mono text-slate-400">{l.rollNumber}</td>
                    <td className="p-3 text-indigo-300">{l.branchName}</td>
                    <td className="p-3 text-slate-300">
                      {l.year} ({l.semester}-{l.section})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-200">
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDateString(l.fromDate)} - {formatDateString(l.toDate)}
                    </td>
                    <td className="p-3 font-bold text-white">{l.numberOfDays}</td>
                    <td className="p-3">
                      <span className={l.counsellorStatus === 'approved' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                        {l.counsellorStatus === 'approved' ? 'Approved' : l.counsellorStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={l.principalStatus === 'approved' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                        {l.principalStatus === 'approved' ? 'Approved' : l.principalStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={l.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
