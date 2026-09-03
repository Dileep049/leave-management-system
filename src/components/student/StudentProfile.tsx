import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User, GraduationCap, Mail, Phone, Hash, ShieldCheck, Lock, Award, BookOpen, Layers, UserCheck } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { studentProfile } = useAuth();
  const { counsellors } = useData();

  if (!studentProfile) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-slate-400 text-sm">No student profile found.</p>
      </div>
    );
  }

  // Dynamic lookup: match student's branchId with counsellors
  const assignedCounsellor = counsellors.find((c) => c.branchId === studentProfile.branchId);

  const profileFields = [
    { label: 'Student Name', value: studentProfile.studentName, icon: User },
    { label: 'Roll Number', value: studentProfile.rollNumber, icon: Hash },
    { label: 'Student ID', value: studentProfile.studentId, icon: ShieldCheck },
    { label: 'Branch', value: studentProfile.branchName, icon: GraduationCap },
    { label: 'Year', value: studentProfile.year, icon: Award },
    { label: 'Semester', value: studentProfile.semester, icon: BookOpen },
    { label: 'Section', value: studentProfile.section, icon: Layers },
    { label: 'Admission Number', value: studentProfile.admissionNumber, icon: Hash },
    { label: 'Email Address', value: studentProfile.email, icon: Mail },
    { label: 'Mobile Number', value: studentProfile.mobileNumber, icon: Phone }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20 border border-white/15 p-4 sm:p-6 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xl sm:text-2xl font-black shrink-0">
            {studentProfile.studentName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{studentProfile.studentName}</h2>
            <p className="text-xs text-indigo-300 font-semibold truncate">{studentProfile.branchName} • {studentProfile.rollNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold self-start sm:self-center shrink-0">
          <Lock className="w-4 h-4 shrink-0" />
          <span className="truncate">Read-Only Academic Record</span>
        </div>
      </div>

      {/* Dynamic Ward Counsellor Information Card */}
      <div className="bg-black/20 border border-white/15 p-4 sm:p-5 rounded-2xl space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4 shrink-0" /> Assigned Branch Ward Counsellor
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-bold shrink-0">
            {studentProfile.branchName}
          </span>
        </div>

        {assignedCounsellor ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {assignedCounsellor.photoUrl ? (
              <img
                src={assignedCounsellor.photoUrl}
                alt={assignedCounsellor.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-sky-500/40 shadow-md shrink-0"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-300 text-lg sm:text-xl font-bold shrink-0">
                {assignedCounsellor.name.charAt(0)}
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate">
                {assignedCounsellor.name}
              </h4>
              <p className="text-xs text-slate-300 font-medium truncate">
                {assignedCounsellor.designation || 'Branch Ward Counsellor'}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" /> {assignedCounsellor.email}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" /> {assignedCounsellor.mobile}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No Ward Counsellor currently assigned to your branch.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {profileFields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx} className="bg-black/20 border border-white/15 p-3.5 sm:p-4 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <div className="p-2.5 rounded-lg bg-white/10 text-indigo-300 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{field.label}</p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{field.value || 'N/A'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
