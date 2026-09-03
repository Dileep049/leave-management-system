import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateString } from '../../utils/dateUtils';
import { FileText, Calendar, Search, Filter } from 'lucide-react';

export const LeaveOverview: React.FC = () => {
  const { leaves, branches } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const filteredLeaves = leaves.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || l.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">System Leave Applications Overview</h2>
          <p className="text-xs text-slate-300 mt-0.5">Read-only oversight across all branches</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
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
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredLeaves.map((leave) => (
          <div key={leave.id} className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{leave.studentName}</h4>
                <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                  {leave.branchName} • Roll: {leave.rollNumber} • {leave.year} ({leave.semester})
                </p>
              </div>
              <div className="self-start sm:self-auto shrink-0">
                <StatusBadge status={leave.status} />
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <p className="font-semibold text-slate-300">Duration: {formatDateString(leave.fromDate)} → {formatDateString(leave.toDate)} ({leave.numberOfDays} days)</p>
              <p className="mt-1 italic text-slate-200">"{leave.reason}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
