import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Login } from './components/auth/Login';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Role Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { CounsellorManagement } from './components/admin/CounsellorManagement';
import { BranchManagement } from './components/admin/BranchManagement';
import { LeaveOverview } from './components/admin/LeaveOverview';

import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfileView } from './components/student/StudentProfile';
import { LeaveHistory } from './components/student/LeaveHistory';
import { ApplyLeaveModal } from './components/student/ApplyLeaveModal';

import { CounsellorDashboard } from './components/counsellor/CounsellorDashboard';
import { BranchLeavesView } from './components/counsellor/BranchLeavesView';
import { CounsellorProfileView } from './components/counsellor/CounsellorProfile';

import { PrincipalDashboard } from './components/principal/PrincipalDashboard';
import { AllLeavesView } from './components/principal/AllLeavesView';
import { CounsellorsDirectoryView } from './components/principal/CounsellorsDirectoryView';

import { MonthlyReportsView } from './components/reports/MonthlyReportsView';
import { UserRole } from './types';

// ProtectedRoute Security Wrapper
interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role, currentUser } = useAuth();

  if (!currentUser || !role) {
    return <Login />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center bg-slate-900/80 border border-white/10 rounded-2xl space-y-3 backdrop-blur-md">
        <h3 className="text-lg font-bold text-rose-400">Access Restricted</h3>
        <p className="text-xs text-slate-300">
          Your assigned role (<span className="font-mono font-bold uppercase">{role}</span>) does not have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const { currentUser, role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-400">Verifying Session & User Metadata...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderActiveContent = () => {
    // ADMIN ROLE
    if (role === 'admin') {
      return (
        <ProtectedRoute allowedRoles={['admin']}>
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'counsellors' && <CounsellorManagement />}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'leaves' && <LeaveOverview />}
          {activeTab === 'reports' && <MonthlyReportsView />}
          {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
        </ProtectedRoute>
      );
    }

    // STUDENT ROLE (Supports 'apply', 'apply-leave', 'apply_leave')
    if (role === 'student') {
      const isApplyTab = activeTab === 'apply' || activeTab === 'apply-leave' || activeTab === 'apply_leave';

      return (
        <ProtectedRoute allowedRoles={['student']}>
          {activeTab === 'profile' && <StudentProfileView />}
          {isApplyTab && (
            <div className="space-y-4">
              <div className="bg-black/20 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold text-white">Apply for Student Leave</h2>
                  <p className="text-xs text-slate-300 mt-1">Submit your leave request for automatic Ward Counsellor routing</p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Open Application Form
                </button>
              </div>
              <LeaveHistory />
            </div>
          )}
          {activeTab === 'history' && <LeaveHistory />}
          {activeTab === 'dashboard' && <StudentDashboard setActiveTab={setActiveTab} />}
        </ProtectedRoute>
      );
    }

    // WARD COUNSELLOR ROLE
    if (role === 'ward_counsellor') {
      return (
        <ProtectedRoute allowedRoles={['ward_counsellor']}>
          {activeTab === 'counsellor_profile' && <CounsellorProfileView />}
          {activeTab === 'branch_leaves' && <BranchLeavesView />}
          {activeTab === 'reports' && <MonthlyReportsView />}
          {activeTab === 'dashboard' && <CounsellorDashboard setActiveTab={setActiveTab} />}
        </ProtectedRoute>
      );
    }

    // PRINCIPAL ROLE
    if (role === 'principal') {
      return (
        <ProtectedRoute allowedRoles={['principal']}>
          {activeTab === 'all_counsellors' && <CounsellorsDirectoryView />}
          {activeTab === 'all_leaves' && <AllLeavesView />}
          {activeTab === 'reports' && <MonthlyReportsView />}
          {activeTab === 'dashboard' && <PrincipalDashboard setActiveTab={setActiveTab} />}
        </ProtectedRoute>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* 1. Background Scenic Image with Rotation & Ultra-Light Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center bg-no-repeat opacity-100"
          style={{ 
            backgroundImage: `url('/scenic-bg.jpg')`,
            animation: 'activeRotate 15s ease-in-out infinite alternate'
          }}
        ></div>
        {/* Minimal overlay so the background image remains crystal clear */}
        <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]"></div>
      </div>

      <style>{`
        @keyframes activeRotate {
          0% { transform: scale(1) rotate(0deg) translate(0px, 0px); }
          50% { transform: scale(1.08) rotate(1.5deg) translate(-10px, -8px); }
          100% { transform: scale(1.12) rotate(-1.5deg) translate(10px, 8px); }
        }
      `}</style>

      {/* 2. Main Dashboard Layout Content (Navbar, Sidebar & Main Area with Glass Style) */}
      <div className="relative z-10 flex flex-col w-full h-screen overflow-hidden">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'apply' || tab === 'apply-leave' || tab === 'apply_leave') {
                setIsApplyModalOpen(true);
              }
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-transparent w-full">
            <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 pb-6">
              {renderActiveContent()}
            </div>
          </main>
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <MainLayout />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
