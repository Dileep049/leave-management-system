export type UserRole = 'admin' | 'student' | 'ward_counsellor' | 'principal';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mobile: string;
  createdAt: string;
  branchId?: string;
  photoUrl?: string;
  designation?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentName: string;
  rollNumber: string;
  studentId: string;
  email: string;
  mobileNumber: string;
  branchId: string;
  branchName: string;
  year: string;
  semester: string;
  section: string;
  admissionNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface WardCounsellor {
  id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  branchId: string;
  branchName: string;
  photoUrl?: string;
  designation?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  wardCounsellorId?: string;
  wardCounsellorName?: string;
  createdAt: string;
}

export type LeaveType = 'Medical' | 'Casual' | 'Duty Leave' | 'Emergency' | 'Special';

export type LeaveStatus = 
  | 'pending_counsellor'
  | 'pending_principal'
  | 'approved'
  | 'rejected';

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  studentCode: string;
  branchId: string;
  branchName: string;
  year: string;
  semester: string;
  section: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  reason: string;
  documentUrl?: string;
  documentName?: string;
  appliedDate: string;
  status: LeaveStatus;
  
  counsellorId?: string;
  counsellorName?: string;
  counsellorStatus?: 'pending' | 'approved' | 'rejected';
  counsellorActionDate?: string;
  counsellorRejectionReason?: string;
  
  principalId?: string;
  principalName?: string;
  principalStatus?: 'pending' | 'approved' | 'rejected';
  principalActionDate?: string;
  principalRejectionReason?: string;
  
  rejectionReason?: string;
}

export interface AppNotification {
  id: string;
  recipientUserId?: string;
  recipientRole?: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  leaveId?: string;
  type: 'leave_applied' | 'counsellor_approved' | 'counsellor_rejected' | 'forwarded_principal' | 'principal_approved' | 'principal_rejected';
}

export interface MonthlyReportSummary {
  monthYear: string;
  monthName: string;
  totalApplications: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  pendingLeaves: number;
  totalLeaveDays: number;
  branchWiseStats: {
    branchId: string;
    branchName: string;
    totalLeaves: number;
    approved: number;
    rejected: number;
    pending: number;
  }[];
}
