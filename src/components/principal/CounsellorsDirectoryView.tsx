import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserCheck, Mail, Phone, Building2, Search, Award } from 'lucide-react';

export const CounsellorsDirectoryView: React.FC = () => {
  const { counsellors, branches, students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const filteredCounsellors = counsellors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.designation && c.designation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = selectedBranch === 'all' || c.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">College Branch Ward Counsellors</h2>
          <p className="text-xs text-slate-300 mt-0.5">Principal Portal Directory • All Branch Heads & Counsellor Profiles</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold self-start sm:self-auto shrink-0">
          {counsellors.length} Assigned Counsellors
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by counsellor name, email, or designation..."
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

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredCounsellors.map((counsellor) => {
          const studentCount = students.filter((s) => s.branchId === counsellor.branchId).length;

          return (
            <div
              key={counsellor.id}
              className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 hover:border-white/25 backdrop-blur-md transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {counsellor.photoUrl ? (
                  <img
                    src={counsellor.photoUrl}
                    alt={counsellor.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center text-xl sm:text-2xl border border-amber-500/30 shrink-0">
                    {counsellor.name.charAt(0)}
                  </div>
                )}

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">{counsellor.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold shrink-0">
                      {studentCount} Students
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-300 font-semibold truncate">{counsellor.designation || 'Ward Counsellor'}</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-300 text-[11px] font-semibold mt-1 truncate">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {counsellor.branchName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{counsellor.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{counsellor.mobile}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
