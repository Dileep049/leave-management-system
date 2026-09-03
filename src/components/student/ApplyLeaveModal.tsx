import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { LeaveType } from '../../types';
import { calculateLeaveDays } from '../../utils/dateUtils';
import { Calendar, FileText, Upload, Sparkles, ShieldCheck } from 'lucide-react';
import { storage, isFirebaseConfigured } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { studentProfile } = useAuth();
  const { submitLeaveApplication } = useData();

  const [leaveType, setLeaveType] = useState<LeaveType>('Medical');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [supportingDocument, setSupportingDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto calculate inclusive days between From Date and To Date
  useEffect(() => {
    if (fromDate && toDate) {
      const days = calculateLeaveDays(fromDate, toDate);
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }
  }, [fromDate, toDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;
    if (!fromDate || !toDate || !reason.trim()) return;

    if (fromDate > toDate) {
      alert("From Date cannot be after To Date.");
      return;
    }

    setIsSubmitting(true);
    let downloadUrl: string | undefined = undefined;

    // Optional Firebase Storage File Upload
    if (supportingDocument) {
      if (isFirebaseConfigured && storage) {
        try {
          const storageRef = ref(storage, `leave_documents/${studentProfile.userId}/${Date.now()}_${supportingDocument.name}`);
          const snapshot = await uploadBytes(storageRef, supportingDocument);
          downloadUrl = await getDownloadURL(snapshot.ref);
        } catch (err) {
          console.warn("Firebase Storage upload error, falling back to URL reference", err);
          downloadUrl = '#';
        }
      } else {
        downloadUrl = '#';
      }
    }

    const success = submitLeaveApplication(
      studentProfile,
      leaveType,
      fromDate,
      toDate,
      reason,
      documentName || undefined,
      downloadUrl
    );

    setIsSubmitting(false);

    if (success) {
      setFromDate('');
      setToDate('');
      setReason('');
      setDocumentName('');
      setSupportingDocument(null);
      onClose();
    }
  };

  if (!studentProfile) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-Only Auto-Populated Student Details Header */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              {studentProfile.studentName} ({studentProfile.rollNumber})
            </p>
            <p className="opacity-80 mt-0.5">{studentProfile.branchName} • {studentProfile.year} ({studentProfile.semester})</p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 font-semibold text-[10px] rounded-lg border border-indigo-500/30 shrink-0">
            Auto Counsellor Binding
          </span>
        </div>

        {/* Leave Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Leave Type *
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="Medical">Medical Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Duty Leave">Duty Leave (Academic / College Representation)</option>
            <option value="Emergency">Emergency Leave</option>
            <option value="Special">Special Permission</option>
          </select>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              From Date *
            </label>
            <input
              type="date"
              required
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              To Date *
            </label>
            <input
              type="date"
              required
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Automatic Read-Only Day Calculation Banner */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">Number of Days:</span>
          </span>
          <span className="font-extrabold text-white text-xs sm:text-sm bg-indigo-600/20 px-3 py-1 rounded-lg border border-indigo-500/30 shrink-0">
            {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* Reason Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Reason for Leave *
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide complete explanation for your leave request..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Optional Supporting Document Uploader */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Supporting Document <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
          </label>
          <input
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSupportingDocument(e.target.files[0]);
                setDocumentName(e.target.files[0].name);
              } else {
                setSupportingDocument(null);
                setDocumentName('');
              }
            }}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || numberOfDays <= 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Uploading & Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
