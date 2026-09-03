import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Building2, Plus, Users, UserCheck } from 'lucide-react';

export const BranchManagement: React.FC = () => {
  const { branches, counsellors, students, createBranch } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    createBranch(code, name);
    setCode('');
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Branch Directory</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Academic department branches used for automatic leave routing
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {branches.map((branch) => {
          const studentCount = students.filter((s) => s.branchId === branch.id).length;
          const assignedCounsellor = counsellors.find((c) => c.branchId === branch.id);

          return (
            <div key={branch.id} className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-md shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    {branch.code}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">{studentCount} Students</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{branch.name}</h3>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Assigned Counsellor</p>
                <p className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{assignedCounsellor ? assignedCounsellor.name : 'Unassigned'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Branch Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Branch" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. AI-ML, CS, BCA"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white uppercase focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. B.Sc (AI & ML)"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
            >
              Create Branch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
