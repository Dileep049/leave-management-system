import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setLocalError('');

    const res = await login(email, password);
    if (!res.success) {
      setLocalError(res.message || 'Invalid login credentials or missing database profile.');
    }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, demoPass);
  };

  const activeError = localError || loginError;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      
      {/* 1. Fast Rotating & Moving 8K Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center bg-no-repeat opacity-100"
          style={{ 
            backgroundImage: `url('/college-bg.jpg')`,
            animation: 'activeRotate 15s ease-in-out infinite alternate'
          }}
        ></div>
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"></div>
      </div>

      <style>{`
        @keyframes activeRotate {
          0% { transform: scale(1) rotate(0deg) translate(0px, 0px); }
          50% { transform: scale(1.08) rotate(2deg) translate(-12px, -10px); }
          100% { transform: scale(1.14) rotate(-2deg) translate(12px, 10px); }
        }
      `}</style>

      {/* 2. Ultra-Transparent Glass Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center bg-white/[0.03] border border-white/15 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Left Side: Login Form with Clear Glass */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm space-y-4 sm:space-y-5">
          <div className="mb-4 sm:mb-6 border-b border-white/10 pb-3 sm:pb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-wider drop-shadow-lg flex items-center gap-2 truncate">
              <Building className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 shrink-0" />
              KBN COLLEGE
            </h1>
            <p className="text-[10px] sm:text-xs text-indigo-200 font-semibold tracking-wider mt-1 truncate">STUDENT LEAVE MANAGEMENT SYSTEM</p>
          </div>

          {activeError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 font-medium backdrop-blur-sm">
              ⚠️ {activeError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-100 mb-1 uppercase tracking-wider">OFFICIAL EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu" 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-300 focus:outline-none focus:border-indigo-400 backdrop-blur-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-slate-100 mb-1 uppercase tracking-wider">PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-2.5" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-9 pr-10 py-2 text-xs sm:text-sm text-white placeholder-slate-300 focus:outline-none focus:border-indigo-400 backdrop-blur-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-indigo-600/40 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Portal →'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-white/15 space-y-2">
            <p className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">⚡ One-Click Quick Fill:</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white rounded-xl text-left truncate backdrop-blur-sm text-[11px] font-medium"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('dileep@student.college.edu', 'Student@123')}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white rounded-xl text-left truncate backdrop-blur-sm text-[11px] font-medium"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('aiml.counsellor@college.edu', 'Counsellor@123')}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white rounded-xl text-left truncate backdrop-blur-sm text-[11px] font-medium"
              >
                👨‍🏫 Counsellor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('principal@college.edu', 'Principal@123')}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-white rounded-xl text-left truncate backdrop-blur-sm text-[11px] font-medium"
              >
                🏫 Principal
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Portal Modules Grid with Ultra Glass */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-md">Access Your Portal</h3>
            <p className="text-xs text-slate-200">Select your academic role to proceed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => handleQuickLogin('dileep@student.college.edu', 'Student@123')}
              className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/10 hover:border-indigo-400/50 rounded-2xl transition cursor-pointer backdrop-blur-sm shadow-lg space-y-1"
            >
              <span className="text-lg">🎓</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">Student Portal</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">Apply leave & history.</p>
            </div>

            <div
              onClick={() => handleQuickLogin('aiml.counsellor@college.edu', 'Counsellor@123')}
              className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/10 hover:border-indigo-400/50 rounded-2xl transition cursor-pointer backdrop-blur-sm shadow-lg space-y-1"
            >
              <span className="text-lg">👨‍🏫</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">Ward Counsellor</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">Branch leave reviews.</p>
            </div>

            <div
              onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
              className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/10 hover:border-indigo-400/50 rounded-2xl transition cursor-pointer backdrop-blur-sm shadow-lg space-y-1"
            >
              <span className="text-lg">👑</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">Admin Portal</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">Account & branch setup.</p>
            </div>

            <div
              onClick={() => handleQuickLogin('principal@college.edu', 'Principal@123')}
              className="p-3.5 sm:p-4 bg-white/[0.02] border border-white/10 hover:border-indigo-400/50 rounded-2xl transition cursor-pointer backdrop-blur-sm shadow-lg space-y-1"
            >
              <span className="text-lg">🏫</span>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">Principal Portal</h4>
              <p className="text-[11px] text-slate-200 mt-0.5">All-branch final approvals.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
