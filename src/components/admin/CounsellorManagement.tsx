import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { UserCheck, Plus, Building2, Mail, Phone } from 'lucide-react';

export const CounsellorManagement: React.FC = () => {
  const { counsellors, branches, createCounsellor } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [branchId, setBranchId] = useState('');

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setMobile('');
    if (branches.length > 0) setBranchId(branches[0].id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !branchId) return;
    createCounsellor(name, email, mobile, branchId);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Ward Counsellor Management</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Assign Ward Counsellors to specific college branches for automatic leave routing
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Ward Counsellor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {counsellors.map((counsellor) => (
          <div key={counsellor.id} className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center text-base border border-sky-500/30 shrink-0">
                {counsellor.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{counsellor.name}</h4>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-semibold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 truncate">
                  <Building2 className="w-3 h-3 shrink-0" /> {counsellor.branchName}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10">
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{counsellor.email}</span>
              </p>
              <p className="flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{counsellor.mobile}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Counsellor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Ward Counsellor" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Counsellor Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Ananya Reddy"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aiml.counsellor@college.edu"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
            <input
              type="text"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98765 43212"
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Branch *</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-indigo-500"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
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
              Assign Counsellor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
