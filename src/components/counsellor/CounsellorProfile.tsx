import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserCheck, Upload, Save, Mail, Phone, Building2, Award, User } from 'lucide-react';

export const CounsellorProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const { counsellors, updateCounsellorProfile } = useData();

  const counsellor = counsellors.find(
    (c) => c.userId === currentUser?.id || c.email.toLowerCase() === currentUser?.email.toLowerCase()
  );

  const [name, setName] = useState(counsellor?.name || currentUser?.name || '');
  const [mobile, setMobile] = useState(counsellor?.mobile || currentUser?.mobile || '');
  const [designation, setDesignation] = useState(counsellor?.designation || currentUser?.designation || 'Ward Counsellor');
  const [photoUrl, setPhotoUrl] = useState(counsellor?.photoUrl || currentUser?.photoUrl || '');
  const [previewPhoto, setPreviewPhoto] = useState(counsellor?.photoUrl || currentUser?.photoUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setPhotoUrl(base64Url);
        setPreviewPhoto(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counsellor) return;
    setIsSaving(true);

    await updateCounsellorProfile(counsellor.id, {
      name,
      mobile,
      designation,
      photoUrl
    });

    setIsSaving(false);
  };

  if (!counsellor) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-slate-400 text-sm">No Ward Counsellor profile found for your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white">My Ward Counsellor Profile</h2>
        <p className="text-xs text-slate-300 mt-0.5">Manage your official contact info, designation, and profile photo</p>
      </div>

      <form onSubmit={handleSave} className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-6 space-y-6 shadow-xl backdrop-blur-md">
        {/* Photo Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 border-b border-white/10">
          <div className="relative group shrink-0">
            {previewPhoto ? (
              <img
                src={previewPhoto}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-sky-500/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-600/20 border-2 border-sky-500/30 flex items-center justify-center text-sky-300 text-2xl sm:text-3xl font-black">
                {name.charAt(0)}
              </div>
            )}
            <label className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              <Upload className="w-6 h-6 text-white" />
              <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{name}</h3>
            <p className="text-xs text-sky-400 font-semibold truncate">{counsellor.branchName} Ward Counsellor</p>
            <p className="text-[11px] text-slate-300">Click photo image to upload and update your official profile picture.</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Academic Designation *
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Associate Professor & AI Ward Head"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Official Email (Read-Only)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={counsellor.email}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Mobile Contact Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
            Assigned Branch: <span className="font-bold text-white">{counsellor.branchName}</span>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
