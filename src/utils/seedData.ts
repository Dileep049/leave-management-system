import { Branch, WardCounsellor, StudentProfile, LeaveApplication, AppNotification, User } from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-aiml',
    code: 'AI-ML',
    name: 'B.Sc (AI & ML)',
    wardCounsellorId: 'counsellor-aiml',
    wardCounsellorName: 'Dr. Ananya Reddy',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'branch-cs',
    code: 'CS',
    name: 'B.Sc Computer Science',
    wardCounsellorId: 'counsellor-cs',
    wardCounsellorName: 'Prof. Rajesh Verma',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'branch-bca',
    code: 'BCA',
    name: 'BCA',
    wardCounsellorId: 'counsellor-bca',
    wardCounsellorName: 'Mrs. Priya Nair',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'branch-ds',
    code: 'DS',
    name: 'B.Sc Data Science',
    wardCounsellorId: 'counsellor-ds',
    wardCounsellorName: 'Dr. Vikram Malhotra',
    createdAt: '2026-01-10T10:00:00.000Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@college.edu',
    name: 'Dr. K. V. Rao',
    role: 'admin',
    mobile: '+91 98765 43210',
    createdAt: '2026-01-01T09:00:00.000Z'
  },
  {
    id: 'user-principal',
    email: 'principal@college.edu',
    name: 'Prof. S. R. Sharma',
    role: 'principal',
    mobile: '+91 98765 43211',
    createdAt: '2026-01-01T09:00:00.000Z'
  },
  {
    id: 'user-counsellor-aiml',
    email: 'aiml.counsellor@college.edu',
    name: 'Dr. Ananya Reddy',
    role: 'ward_counsellor',
    mobile: '+91 98765 43212',
    branchId: 'branch-aiml',
    designation: 'Associate Professor & AI Ward Head',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-counsellor-cs',
    email: 'cs.counsellor@college.edu',
    name: 'Prof. Rajesh Verma',
    role: 'ward_counsellor',
    mobile: '+91 98765 43213',
    branchId: 'branch-cs',
    designation: 'Professor & CS Department Lead',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-counsellor-bca',
    email: 'bca.counsellor@college.edu',
    name: 'Mrs. Priya Nair',
    role: 'ward_counsellor',
    mobile: '+91 98765 43214',
    branchId: 'branch-bca',
    designation: 'Assistant Professor & BCA Coordinator',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-counsellor-ds',
    email: 'ds.counsellor@college.edu',
    name: 'Dr. Vikram Malhotra',
    role: 'ward_counsellor',
    mobile: '+91 98765 43215',
    branchId: 'branch-ds',
    designation: 'Senior Lecturer & Data Analytics Head',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-student-dileep',
    email: 'dileep@student.college.edu',
    name: 'Dileep Kumar',
    role: 'student',
    mobile: '+91 91234 56789',
    branchId: 'branch-aiml',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'user-student-sneha',
    email: 'sneha@student.college.edu',
    name: 'Sneha Patel',
    role: 'student',
    mobile: '+91 91234 56790',
    branchId: 'branch-cs',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'user-student-rahul',
    email: 'rahul@student.college.edu',
    name: 'Rahul Mehta',
    role: 'student',
    mobile: '+91 91234 56791',
    branchId: 'branch-bca',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'user-student-kavya',
    email: 'kavya@student.college.edu',
    name: 'Kavya Swaminathan',
    role: 'student',
    mobile: '+91 91234 56792',
    branchId: 'branch-ds',
    createdAt: '2026-02-01T10:00:00.000Z'
  }
];

export const INITIAL_COUNSELLORS: WardCounsellor[] = [
  {
    id: 'counsellor-aiml',
    userId: 'user-counsellor-aiml',
    name: 'Dr. Ananya Reddy',
    email: 'aiml.counsellor@college.edu',
    mobile: '+91 98765 43212',
    branchId: 'branch-aiml',
    branchName: 'B.Sc (AI & ML)',
    designation: 'Associate Professor & AI Ward Head',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'counsellor-cs',
    userId: 'user-counsellor-cs',
    name: 'Prof. Rajesh Verma',
    email: 'cs.counsellor@college.edu',
    mobile: '+91 98765 43213',
    branchId: 'branch-cs',
    branchName: 'B.Sc Computer Science',
    designation: 'Professor & CS Department Lead',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'counsellor-bca',
    userId: 'user-counsellor-bca',
    name: 'Mrs. Priya Nair',
    email: 'bca.counsellor@college.edu',
    mobile: '+91 98765 43214',
    branchId: 'branch-bca',
    branchName: 'BCA',
    designation: 'Assistant Professor & BCA Coordinator',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'counsellor-ds',
    userId: 'user-counsellor-ds',
    name: 'Dr. Vikram Malhotra',
    email: 'ds.counsellor@college.edu',
    mobile: '+91 98765 43215',
    branchId: 'branch-ds',
    branchName: 'B.Sc Data Science',
    designation: 'Senior Lecturer & Data Analytics Head',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-01-10T10:00:00.000Z'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-dileep',
    userId: 'user-student-dileep',
    studentName: 'Dileep Kumar',
    rollNumber: '21AIML042',
    studentId: 'STU-1001',
    email: 'dileep@student.college.edu',
    mobileNumber: '+91 91234 56789',
    branchId: 'branch-aiml',
    branchName: 'B.Sc (AI & ML)',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    admissionNumber: 'ADM-2023-8801',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'student-sneha',
    userId: 'user-student-sneha',
    studentName: 'Sneha Patel',
    rollNumber: '22CS015',
    studentId: 'STU-1002',
    email: 'sneha@student.college.edu',
    mobileNumber: '+91 91234 56790',
    branchId: 'branch-cs',
    branchName: 'B.Sc Computer Science',
    year: '2nd Year',
    semester: 'Semester 3',
    section: 'B',
    admissionNumber: 'ADM-2024-5412',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'student-rahul',
    userId: 'user-student-rahul',
    studentName: 'Rahul Mehta',
    rollNumber: '20BCA088',
    studentId: 'STU-1003',
    email: 'rahul@student.college.edu',
    mobileNumber: '+91 91234 56791',
    branchId: 'branch-bca',
    branchName: 'BCA',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'A',
    admissionNumber: 'ADM-2023-1109',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'student-kavya',
    userId: 'user-student-kavya',
    studentName: 'Kavya Swaminathan',
    rollNumber: '23DS004',
    studentId: 'STU-1004',
    email: 'kavya@student.college.edu',
    mobileNumber: '+91 91234 56792',
    branchId: 'branch-ds',
    branchName: 'B.Sc Data Science',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'C',
    admissionNumber: 'ADM-2025-9003',
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z'
  }
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'leave-101',
    studentId: 'student-dileep',
    studentName: 'Dileep Kumar',
    rollNumber: '21AIML042',
    studentCode: 'STU-1001',
    branchId: 'branch-aiml',
    branchName: 'B.Sc (AI & ML)',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    leaveType: 'Medical',
    fromDate: '2026-09-05',
    toDate: '2026-09-07',
    numberOfDays: 3,
    reason: 'High fever and viral infection. Doctor advised bed rest for 3 days.',
    appliedDate: '2026-09-02T14:30:00.000Z',
    status: 'pending_counsellor',
    counsellorId: 'counsellor-aiml',
    counsellorName: 'Dr. Ananya Reddy',
    counsellorStatus: 'pending'
  },
  {
    id: 'leave-102',
    studentId: 'student-sneha',
    studentName: 'Sneha Patel',
    rollNumber: '22CS015',
    studentCode: 'STU-1002',
    branchId: 'branch-cs',
    branchName: 'B.Sc Computer Science',
    year: '2nd Year',
    semester: 'Semester 3',
    section: 'B',
    leaveType: 'Duty Leave',
    fromDate: '2026-09-10',
    toDate: '2026-09-11',
    numberOfDays: 2,
    reason: 'Representing college at Inter-College Hackathon Competition at IIT Hyderabad.',
    appliedDate: '2026-09-01T09:15:00.000Z',
    status: 'pending_principal',
    counsellorId: 'counsellor-cs',
    counsellorName: 'Prof. Rajesh Verma',
    counsellorStatus: 'approved',
    counsellorActionDate: '2026-09-01T11:00:00.000Z',
    principalStatus: 'pending'
  },
  {
    id: 'leave-103',
    studentId: 'student-rahul',
    studentName: 'Rahul Mehta',
    rollNumber: '20BCA088',
    studentCode: 'STU-1003',
    branchId: 'branch-bca',
    branchName: 'BCA',
    year: '3rd Year',
    semester: 'Semester 6',
    section: 'A',
    leaveType: 'Casual',
    fromDate: '2026-08-15',
    toDate: '2026-08-18',
    numberOfDays: 4,
    reason: 'Attending elder sister’s wedding ceremony in hometown.',
    appliedDate: '2026-08-10T16:20:00.000Z',
    status: 'approved',
    counsellorId: 'counsellor-bca',
    counsellorName: 'Mrs. Priya Nair',
    counsellorStatus: 'approved',
    counsellorActionDate: '2026-08-11T09:30:00.000Z',
    principalId: 'user-principal',
    principalName: 'Prof. S. R. Sharma',
    principalStatus: 'approved',
    principalActionDate: '2026-08-11T14:10:00.000Z'
  },
  {
    id: 'leave-104',
    studentId: 'student-kavya',
    studentName: 'Kavya Swaminathan',
    rollNumber: '23DS004',
    studentCode: 'STU-1004',
    branchId: 'branch-ds',
    branchName: 'B.Sc Data Science',
    year: '1st Year',
    semester: 'Semester 1',
    section: 'C',
    leaveType: 'Casual',
    fromDate: '2026-08-20',
    toDate: '2026-08-20',
    numberOfDays: 1,
    reason: 'Personal urgent work at passport office.',
    appliedDate: '2026-08-18T11:00:00.000Z',
    status: 'rejected',
    counsellorId: 'counsellor-ds',
    counsellorName: 'Dr. Vikram Malhotra',
    counsellorStatus: 'rejected',
    counsellorActionDate: '2026-08-18T15:00:00.000Z',
    counsellorRejectionReason: 'Mid-semester practical examination scheduled on the same date.',
    rejectionReason: 'Mid-semester practical examination scheduled on the same date.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientUserId: 'user-counsellor-aiml',
    recipientRole: 'ward_counsellor',
    title: 'New Leave Request',
    message: 'Dileep Kumar (B.Sc AI & ML) submitted a Medical leave request for 3 days.',
    timestamp: '2026-09-02T14:30:00.000Z',
    read: false,
    leaveId: 'leave-101',
    type: 'leave_applied'
  },
  {
    id: 'notif-2',
    recipientUserId: 'user-principal',
    recipientRole: 'principal',
    title: 'Leave Pending Approval',
    message: 'Prof. Rajesh Verma forwarded a Duty Leave request from Sneha Patel (B.Sc CS).',
    timestamp: '2026-09-01T11:00:00.000Z',
    read: false,
    leaveId: 'leave-102',
    type: 'forwarded_principal'
  },
  {
    id: 'notif-3',
    recipientUserId: 'user-student-rahul',
    recipientRole: 'student',
    title: 'Leave Approved',
    message: 'Your Casual leave request for 4 days (Aug 15 - Aug 18) has been approved by the Principal.',
    timestamp: '2026-08-11T14:10:00.000Z',
    read: true,
    leaveId: 'leave-103',
    type: 'principal_approved'
  }
];
