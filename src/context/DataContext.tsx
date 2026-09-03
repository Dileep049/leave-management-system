import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Branch,
  WardCounsellor,
  StudentProfile,
  LeaveApplication,
  AppNotification,
  User,
  LeaveType
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_COUNSELLORS,
  INITIAL_STUDENTS,
  INITIAL_LEAVES,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from '../utils/seedData';
import { calculateLeaveDays } from '../utils/dateUtils';
import { useToast } from './ToastContext';
import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

interface DataContextType {
  branches: Branch[];
  counsellors: WardCounsellor[];
  students: StudentProfile[];
  leaves: LeaveApplication[];
  notifications: AppNotification[];
  users: User[];
  
  // Branch Management
  createBranch: (code: string, name: string) => void;
  
  // Counsellor Management
  createCounsellor: (name: string, email: string, mobile: string, branchId: string) => void;
  updateCounsellorProfile: (counsellorId: string, data: Partial<WardCounsellor>) => Promise<void>;
  
  // Student Management
  createStudentAccount: (data: Omit<StudentProfile, 'id' | 'createdAt' | 'isActive'> & { tempPassword?: string }) => void;
  updateStudentAccount: (id: string, data: Partial<StudentProfile>) => void;
  toggleStudentStatus: (id: string) => void;
  resetStudentPassword: (id: string) => string;
  
  // Leave Workflow
  submitLeaveApplication: (
    studentProfile: StudentProfile,
    leaveType: LeaveType,
    fromDate: string,
    toDate: string,
    reason: string,
    documentName?: string,
    documentUrl?: string
  ) => boolean;
  
  counsellorProcessLeave: (
    leaveId: string,
    action: 'approve' | 'reject',
    counsellorUser: User,
    rejectionReason?: string
  ) => Promise<void>;
  
  principalProcessLeave: (
    leaveId: string,
    action: 'approve' | 'reject',
    principalUser: User,
    rejectionReason?: string
  ) => Promise<void>;
  
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('slm_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [counsellors, setCounsellors] = useState<WardCounsellor[]>(() => {
    const saved = localStorage.getItem('slm_counsellors');
    return saved ? JSON.parse(saved) : INITIAL_COUNSELLORS;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('slm_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [leaves, setLeaves] = useState<LeaveApplication[]>(() => {
    const saved = localStorage.getItem('slm_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('slm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('slm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Save to Local Storage whenever data updates
  useEffect(() => {
    localStorage.setItem('slm_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('slm_counsellors', JSON.stringify(counsellors));
  }, [counsellors]);

  useEffect(() => {
    localStorage.setItem('slm_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('slm_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('slm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('slm_users', JSON.stringify(users));
  }, [users]);

  // Branch Management
  const createBranch = (code: string, name: string) => {
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      createdAt: new Date().toISOString()
    };
    setBranches((prev) => [...prev, newBranch]);
    showToast('success', 'Branch Created', `Branch ${name} (${code}) added successfully.`);
  };

  // Counsellor Management
  const createCounsellor = (name: string, email: string, mobile: string, branchId: string) => {
    const targetBranch = branches.find((b) => b.id === branchId);
    if (!targetBranch) {
      showToast('error', 'Branch Not Found', 'Selected branch does not exist.');
      return;
    }

    const userId = `user-counsellor-${Date.now()}`;
    const counsellorId = `counsellor-${Date.now()}`;

    const newUser: User = {
      id: userId,
      email,
      name,
      role: 'ward_counsellor',
      mobile,
      branchId,
      createdAt: new Date().toISOString()
    };

    const newCounsellor: WardCounsellor = {
      id: counsellorId,
      userId,
      name,
      email,
      mobile,
      branchId,
      branchName: targetBranch.name,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setCounsellors((prev) => [...prev, newCounsellor]);

    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId
          ? { ...b, wardCounsellorId: counsellorId, wardCounsellorName: name }
          : b
      )
    );

    showToast('success', 'Counsellor Created', `Assigned ${name} to ${targetBranch.name}.`);
  };

  const updateCounsellorProfile = async (counsellorId: string, data: Partial<WardCounsellor>) => {
    setCounsellors((prev) =>
      prev.map((c) => (c.id === counsellorId || c.userId === counsellorId ? { ...c, ...data } : c))
    );

    const counsellor = counsellors.find((c) => c.id === counsellorId || c.userId === counsellorId);

    if (counsellor) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === counsellor.userId || u.email.toLowerCase() === counsellor.email.toLowerCase()
            ? {
                ...u,
                name: data.name || u.name,
                mobile: data.mobile || u.mobile,
                photoUrl: data.photoUrl || u.photoUrl,
                designation: data.designation || u.designation
              }
            : u
        )
      );

      // Firestore sync if connected
      if (isFirebaseConfigured && db) {
        try {
          const docRef = doc(db, 'users', counsellor.userId);
          await updateDoc(docRef, {
            name: data.name || counsellor.name,
            mobile: data.mobile || counsellor.mobile,
            photoUrl: data.photoUrl || counsellor.photoUrl,
            designation: data.designation || counsellor.designation
          });
        } catch (e) {
          console.warn("Firestore update error:", e);
        }
      }
    }

    showToast('success', 'Profile Updated', 'Ward Counsellor profile & photo updated successfully.');
  };

  // Student Account Creation
  const createStudentAccount = (
    data: Omit<StudentProfile, 'id' | 'createdAt' | 'isActive'> & { tempPassword?: string }
  ) => {
    const targetBranch = branches.find((b) => b.id === data.branchId || b.name === data.branchName);
    const resolvedBranchName = targetBranch ? targetBranch.name : data.branchName;
    const resolvedBranchId = targetBranch ? targetBranch.id : data.branchId;

    const userId = `user-student-${Date.now()}`;
    const studentProfileId = `student-${Date.now()}`;

    const newUser: User = {
      id: userId,
      email: data.email,
      name: data.studentName,
      role: 'student',
      mobile: data.mobileNumber,
      branchId: resolvedBranchId,
      createdAt: new Date().toISOString()
    };

    const newStudent: StudentProfile = {
      ...data,
      id: studentProfileId,
      userId,
      branchId: resolvedBranchId,
      branchName: resolvedBranchName,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [...prev, newUser]);
    setStudents((prev) => [...prev, newStudent]);
    showToast('success', 'Student Account Created', `${data.studentName} (${data.rollNumber}) registered successfully.`);
  };

  const updateStudentAccount = (id: string, updatedData: Partial<StudentProfile>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );

    const student = students.find((s) => s.id === id);
    if (student) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === student.userId
            ? {
                ...u,
                name: updatedData.studentName || u.name,
                mobile: updatedData.mobileNumber || u.mobile,
                email: updatedData.email || u.email
              }
            : u
        )
      );
    }
    showToast('success', 'Profile Updated', 'Student details updated successfully.');
  };

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    showToast('info', 'Status Changed', 'Student active status updated.');
  };

  const resetStudentPassword = (id: string): string => {
    const tempPass = `TempPass@${Math.floor(1000 + Math.random() * 9000)}`;
    showToast('success', 'Password Reset', `Temporary Password generated: ${tempPass}`);
    return tempPass;
  };

  // AUTOMATIC BRANCH ROUTING LEAVE APPLICATION
  const submitLeaveApplication = (
    studentProfile: StudentProfile,
    leaveType: LeaveType,
    fromDate: string,
    toDate: string,
    reason: string,
    documentName?: string,
    documentUrl?: string
  ): boolean => {
    const days = calculateLeaveDays(fromDate, toDate);
    if (days <= 0) {
      showToast('error', 'Invalid Date Range', 'To Date must be equal to or after From Date.');
      return false;
    }

    const branchCounsellor = counsellors.find((c) => c.branchId === studentProfile.branchId);

    const leaveId = `leave-${Date.now()}`;
    const newLeave: LeaveApplication = {
      id: leaveId,
      studentId: studentProfile.id,
      studentName: studentProfile.studentName,
      rollNumber: studentProfile.rollNumber,
      studentCode: studentProfile.studentId,
      branchId: studentProfile.branchId,
      branchName: studentProfile.branchName,
      year: studentProfile.year,
      semester: studentProfile.semester,
      section: studentProfile.section,
      leaveType,
      fromDate,
      toDate,
      numberOfDays: days,
      reason,
      documentName,
      documentUrl,
      appliedDate: new Date().toISOString(),
      status: 'pending_counsellor',
      counsellorId: branchCounsellor ? branchCounsellor.id : undefined,
      counsellorName: branchCounsellor ? branchCounsellor.name : 'Branch Counsellor',
      counsellorStatus: 'pending'
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Firestore sync if configured
    if (isFirebaseConfigured && db) {
      try {
        const leaveDocRef = doc(db, 'leaveApplications', leaveId);
        setDoc(leaveDocRef, newLeave);
      } catch (err) {
        console.warn("Firestore leave insert error:", err);
      }
    }

    const counsellorNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientUserId: branchCounsellor?.userId,
      recipientRole: 'ward_counsellor',
      title: 'New Leave Request Received',
      message: `${studentProfile.studentName} (${studentProfile.branchName}) applied for ${days} day(s) ${leaveType} leave.`,
      timestamp: new Date().toISOString(),
      read: false,
      leaveId,
      type: 'leave_applied'
    };

    const studentNotification: AppNotification = {
      id: `notif-${Date.now() + 1}`,
      recipientUserId: studentProfile.userId,
      recipientRole: 'student',
      title: 'Leave Application Submitted',
      message: `Your ${leaveType} leave application (${days} days) has been routed to Ward Counsellor (${branchCounsellor?.name || 'Assigned Counsellor'}).`,
      timestamp: new Date().toISOString(),
      read: false,
      leaveId,
      type: 'leave_applied'
    };

    setNotifications((prev) => [counsellorNotification, studentNotification, ...prev]);
    showToast(
      'success',
      'Leave Submitted Successfully',
      `Routed to ${branchCounsellor?.name || 'Branch Ward Counsellor'} for approval.`
    );
    return true;
  };

  // WARD COUNSELLOR MANUAL APPROVE & REJECT ACTION
  const counsellorProcessLeave = async (
    leaveId: string,
    action: 'approve' | 'reject',
    counsellorUser: User,
    rejectionReason?: string
  ) => {
    const leave = leaves.find((l) => l.id === leaveId);
    if (!leave) return;

    const isApprove = action === 'approve';
    const newStatus = isApprove ? 'pending_principal' : 'rejected';
    const updatedCounsellorStatus = isApprove ? 'approved' : 'rejected';
    const actionTimestamp = new Date().toISOString();

    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: newStatus,
              counsellorId: counsellorUser.id,
              counsellorName: counsellorUser.name,
              counsellorStatus: updatedCounsellorStatus,
              counsellorActionDate: actionTimestamp,
              counsellorRejectionReason: isApprove ? undefined : rejectionReason,
              rejectionReason: isApprove ? undefined : rejectionReason
            }
          : l
      )
    );

    // Firestore sync
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'leaveApplications', leaveId);
        await updateDoc(docRef, {
          status: newStatus,
          counsellorId: counsellorUser.id,
          counsellorName: counsellorUser.name,
          counsellorStatus: updatedCounsellorStatus,
          counsellorActionDate: actionTimestamp,
          counsellorRejectionReason: isApprove ? null : rejectionReason,
          rejectionReason: isApprove ? null : rejectionReason
        });
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    const student = students.find((s) => s.id === leave.studentId);
    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientUserId: student?.userId,
      recipientRole: 'student',
      title: isApprove ? 'Forwarded to Principal' : 'Leave Request Rejected by Ward Counsellor',
      message: isApprove
        ? `Ward Counsellor ${counsellorUser.name} approved your leave request and forwarded it to the Principal for final approval.`
        : `Ward Counsellor ${counsellorUser.name} rejected your leave request. Reason: ${rejectionReason}`,
      timestamp: actionTimestamp,
      read: false,
      leaveId,
      type: isApprove ? 'counsellor_approved' : 'counsellor_rejected'
    };

    const notifsToInsert: AppNotification[] = [studentNotif];
    if (isApprove) {
      const principalNotif: AppNotification = {
        id: `notif-${Date.now() + 1}`,
        recipientRole: 'principal',
        title: 'New Leave Request Pending Approval',
        message: `${leave.studentName} (${leave.branchName}) leave request approved by ${counsellorUser.name} and awaits your final decision.`,
        timestamp: actionTimestamp,
        read: false,
        leaveId,
        type: 'forwarded_principal'
      };
      notifsToInsert.push(principalNotif);
    }

    setNotifications((prev) => [...notifsToInsert, ...prev]);
    showToast(
      isApprove ? 'success' : 'info',
      isApprove ? 'Leave Approved & Forwarded' : 'Leave Application Rejected',
      isApprove ? 'Application sent to Principal for final approval.' : `Reason recorded.`
    );
  };

  // PRINCIPAL MANUAL FINAL APPROVE & REJECT ACTION
  const principalProcessLeave = async (
    leaveId: string,
    action: 'approve' | 'reject',
    principalUser: User,
    rejectionReason?: string
  ) => {
    const leave = leaves.find((l) => l.id === leaveId);
    if (!leave) return;

    const isApprove = action === 'approve';
    const newStatus = isApprove ? 'approved' : 'rejected';
    const updatedPrincipalStatus = isApprove ? 'approved' : 'rejected';
    const actionTimestamp = new Date().toISOString();

    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: newStatus,
              principalId: principalUser.id,
              principalName: principalUser.name,
              principalStatus: updatedPrincipalStatus,
              principalActionDate: actionTimestamp,
              principalRejectionReason: isApprove ? undefined : rejectionReason,
              rejectionReason: isApprove ? l.rejectionReason : rejectionReason
            }
          : l
      )
    );

    // Firestore sync
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'leaveApplications', leaveId);
        await updateDoc(docRef, {
          status: newStatus,
          principalId: principalUser.id,
          principalName: principalUser.name,
          principalStatus: updatedPrincipalStatus,
          principalActionDate: actionTimestamp,
          principalRejectionReason: isApprove ? null : rejectionReason,
          rejectionReason: isApprove ? leave.rejectionReason : rejectionReason
        });
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    const student = students.find((s) => s.id === leave.studentId);
    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientUserId: student?.userId,
      recipientRole: 'student',
      title: isApprove ? 'Leave Approved by Principal' : 'Leave Rejected by Principal',
      message: isApprove
        ? `Your leave request from ${leave.fromDate} to ${leave.toDate} has received FINAL APPROVAL from the Principal.`
        : `Your leave request was rejected by the Principal. Reason: ${rejectionReason}`,
      timestamp: actionTimestamp,
      read: false,
      leaveId,
      type: isApprove ? 'principal_approved' : 'principal_rejected'
    };

    setNotifications((prev) => [studentNotif, ...prev]);
    showToast(
      isApprove ? 'success' : 'info',
      isApprove ? 'Final Approval Granted' : 'Application Rejected',
      isApprove ? 'Student has been notified of final approval.' : 'Student notified.'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <DataContext.Provider
      value={{
        branches,
        counsellors,
        students,
        leaves,
        notifications,
        users,
        createBranch,
        createCounsellor,
        updateCounsellorProfile,
        createStudentAccount,
        updateStudentAccount,
        toggleStudentStatus,
        resetStudentPassword,
        submitLeaveApplication,
        counsellorProcessLeave,
        principalProcessLeave,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
