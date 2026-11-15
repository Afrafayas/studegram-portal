import { ActionButton, ActionForm } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import API from '../api/axios';
import unigatherLogo from '../assets/unigather-logo.jpg';
import unigatherMascot from '../assets/unigather-mascot.png';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and loading states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [accountStatusModal, setAccountStatusModal] = useState(null); // { status: 'Pending' | 'Rejected', message: '', reason: '' }

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Email validate
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validate
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;

    setIsLoading(true);

    return API.post('/partners/login', { email, password })
    .then((res) => {
      const data = res.data;
      if (!data?.success) {
        throw new Error(data?.message || 'Invalid credentials');
      }

      localStorage.setItem('partner_token', data.token);
      localStorage.setItem('partner_data', JSON.stringify(data.data));
      onLoginSuccess();
    })
    .catch((err) => {
      const serverStatus = err.response?.data?.status;
      const serverMessage = err.response?.data?.message || err.message;
      const rejectionReason = err.response?.data?.rejectionReason || '';

      if (serverStatus === 'Pending' || serverStatus === 'Rejected') {
        setAccountStatusModal({
          status: serverStatus,
          message: serverMessage,
          reason: rejectionReason
        });
      } else {
        setLoginError(serverMessage || 'An error occurred during sign in.');
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleOpenForgotModal = (e) => {
    e.preventDefault();
    setForgotEmail(email || '');
    setForgotError('');
    setForgotSuccess('');
    setShowForgotModal(true);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await API.post('/partners/forgot-password', { email: forgotEmail.trim() });
      if (res.data?.success) {
        setForgotSuccess(res.data.message || 'A new 6-digit password has been sent to your registered email address.');
        setEmail(forgotEmail.trim());
      } else {
        throw new Error(res.data?.message || 'Failed to send reset password.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || 'Failed to reset password. Please check your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const getAlertConfig = () => {
    if (!loginError) return null;
    const lower = loginError.toLowerCase();
    
    if (lower.includes('pending') || lower.includes('approval') || lower.includes('review')) {
      return {
        bg: 'bg-amber-50/75 border-amber-200/80 text-amber-900',
        titleColor: 'text-amber-800',
        title: 'Registration Under Review',
        icon: (
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }

    if (lower.includes('rejected')) {
      return {
        bg: 'bg-rose-50/75 border-rose-200/80 text-rose-900',
        titleColor: 'text-rose-800',
        title: 'Registration Rejected',
        icon: (
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
    
    if (lower.includes('deactivated') || lower.includes('inactive')) {
      return {
        bg: 'bg-rose-50/75 border-rose-200/80 text-rose-900',
        titleColor: 'text-rose-800',
        title: 'Account Suspended',
        icon: (
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )
      };
    }

    return {
      bg: 'bg-red-50/75 border-red-200/80 text-red-900',
      titleColor: 'text-red-800',
      title: 'Sign In Failed',
      icon: (
        <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    };
  };

  const alertConfig = getAlertConfig();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-stretch select-none">
      
      {/* Left side (50%): Premium Brand graphic panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#D99A1C] via-[#CA8A14] to-[#B07609] text-white p-8 lg:p-10 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Transparent Icon Pattern Background with depth */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: 'url(/assets/login_hero_pattern.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 pointer-events-none"></div>

        {/* Ambient radial lighting orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top: Logo Brand */}
        <div className="flex items-center gap-3.5 relative z-10 shrink-0">
          <img
            src={unigatherLogo}
            alt="Unigather"
            className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/20 select-none pointer-events-none"
          />
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tight text-white drop-shadow-xs">Unigather</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white/95 backdrop-blur-xs border border-white/25">
              Agency Portal
            </span>
          </div>
        </div>

        {/* Center: Hero Statement & Mascot */}
        <div className="space-y-4 xl:space-y-5 max-w-xl relative z-10 my-auto py-2">
          <div className="space-y-1.5">
            <h2 className="text-2xl xl:text-3xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              Empowering Student Journeys Worldwide
            </h2>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Manage student records, track university deadlines, search thousands of academic courses, and file applications in one unified dashboard.
            </p>
          </div>

          {/* Unigather Mascot - Centered & Prominent */}
          <div className="w-full py-1 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform scale-95"></div>
              <img
                src={unigatherMascot}
                alt="Unigather Mascot"
                className="h-36 sm:h-40 lg:h-44 xl:h-48 w-auto object-contain drop-shadow-2xl select-none pointer-events-none relative z-10 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* 3 Modern Feature Cards */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 transition-all shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide">Manage Student Applications</div>
                <div className="text-[11px] text-white/80 leading-tight">Fast-track submissions and track status stages in real time</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 transition-all shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide">Search 100k+ Active Courses</div>
                <div className="text-[11px] text-white/80 leading-tight">Global university database with verified entry criteria</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2 transition-all shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide">Track Deadlines & Commissions</div>
                <div className="text-[11px] text-white/80 leading-tight">Stay on top of intake cut-offs and claim verified commissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Footer copyright - positioned lower down with proper space */}
        <div className="text-[11px] text-white/75 font-medium relative z-10 flex items-center justify-between pt-4 mt-auto shrink-0 border-t border-white/10">
          <span>© 2026 Unigather Inc. All rights reserved.</span>
          <span className="text-white/60">Global Education Admissions</span>
        </div>
      </div>

      {/* Right side (50%): Form card centered */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/30 relative overflow-hidden">
        {/* Soft background ambient lights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white border border-slate-200/80 border-t-4 border-t-[#D99A1C] rounded-3xl shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08)] p-7 sm:p-9 space-y-6 relative z-10">
          
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 pb-1">
            <img src={unigatherLogo} alt="Unigather" className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200/60" />
            <div className="flex flex-col text-left">
              <span className="font-black text-lg tracking-tight text-[#07163B] leading-tight">Unigather</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partner Portal</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-[#B87C0E] border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D99A1C]"></span>
              Agency Portal Sign In
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">Welcome back</h1>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed">Sign in to your agency account to manage applications and students</p>
          </div>

          {/* Form fields */}
          {alertConfig && (
            <div className={`border p-4 rounded-xl flex gap-3 text-xs shadow-xs backdrop-blur-xs transition-all duration-300 ${alertConfig.bg}`}>
              {alertConfig.icon}
              <div className="space-y-1 text-left">
                <p className={`font-bold text-[10px] uppercase tracking-wider ${alertConfig.titleColor}`}>{alertConfig.title}</p>
                <p className="leading-relaxed font-semibold">{loginError}</p>
              </div>
            </div>
          )}

          <ActionForm onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  className={`w-full bg-slate-50/70 hover:bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D99A1C]/25 transition-all ${
                    emailError
                      ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]'
                      : 'border-slate-200 focus:border-[#D99A1C]'
                  }`}
                  placeholder="name@agency.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{emailError}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full bg-slate-50/70 hover:bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D99A1C]/25 transition-all ${
                    passwordError
                      ? 'border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]'
                      : 'border-slate-200 focus:border-[#D99A1C]'
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  disabled={isLoading}
                />
                {/* Eye toggle icon */}
                <ActionButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </ActionButton>
              </div>
              {passwordError && (
                <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{passwordError}</p>
              )}
            </div>

            {/* Remember me & Forgot password row */}
            <div className="flex items-center justify-between text-xs select-none pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#D99A1C] border-slate-300 focus:ring-[#D99A1C] cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Remember me
              </label>
              <ActionButton
                type="button"
                onClick={handleOpenForgotModal}
                className="text-[#D99A1C] hover:text-[#C28410] font-bold hover:underline cursor-pointer focus:outline-none"
              >
                Forgot password?
              </ActionButton>
            </div>

            {/* Submit button with loading state */}
            <ActionButton
              type="submit"
              className="w-full bg-[#D99A1C] hover:bg-[#C28410] active:scale-[0.99] text-[#07163B] font-black py-3 rounded-xl text-xs transition-all duration-150 shadow-md shadow-amber-500/20 uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#07163B]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg className="w-4 h-4 text-[#07163B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </ActionButton>
          </ActionForm>

          {/* Bottom redirection */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an agency account?{' '}
              <ActionButton
                onClick={() => onNavigate('register')}
                className="text-[#D99A1C] hover:text-[#C28410] font-black hover:underline cursor-pointer"
                disabled={isLoading}
              >
                Register here
              </ActionButton>
            </p>
            {localStorage.getItem('registration_status_token') && (
              <ActionButton
                type="button"
                onClick={() => onNavigate('registration-status')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#D99A1C] transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#D99A1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Track registration status & notifications</span>
              </ActionButton>
            )}
          </div>

        </div>
      </div>

      {/* Account Status Modal (Pending / Rejected) */}
      {accountStatusModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center max-h-[90vh] overflow-y-auto my-auto">
            {accountStatusModal.status === 'Pending' ? (
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}

            <div className="space-y-1">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                accountStatusModal.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {accountStatusModal.status === 'Pending' ? 'Registration Under Review' : 'Registration Rejected'}
              </span>
              <h3 className="text-xl font-bold text-[#0F172A] pt-1">
                {accountStatusModal.status === 'Pending' ? 'Verification Pending' : 'Application Not Approved'}
              </h3>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              {accountStatusModal.message}
            </p>

            {accountStatusModal.reason && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-left space-y-1">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Rejection Reason from Admin:</p>
                <p className="text-xs text-rose-900 font-semibold">{accountStatusModal.reason}</p>
              </div>
            )}

            <ActionButton
              onClick={() => setAccountStatusModal(null)}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider cursor-pointer"
            >
              Close Window
            </ActionButton>

            <div className="pt-1 text-center">
              <ActionButton
                type="button"
                onClick={() => setAccountStatusModal(null)}
                className="text-xs text-slate-500 hover:text-[#D99A1C] font-bold underline transition-colors cursor-pointer"
              >
                Back to Login Page
              </ActionButton>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200 select-none overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto my-auto">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D99A1C] to-[#F5B025]"></div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="text-left">
                <span className="text-[10px] font-black text-[#D99A1C] uppercase tracking-wider">Account Recovery</span>
                <h3 className="text-lg font-bold text-[#0F172A]">Forgot Password</h3>
              </div>
              <ActionButton
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ActionButton>
            </div>

            <p className="text-xs text-slate-600 text-left leading-relaxed">
              Enter your registered agency email address. A randomly generated <strong>6-digit password</strong> will be sent to your email immediately.
            </p>

            {forgotError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl text-left font-medium">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="space-y-4 py-2 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">New Password Dispatched!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {forgotSuccess}
                  </p>
                  <p className="text-[11px] text-amber-800 font-semibold bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl mt-2 text-left">
                    Check your email inbox or spam folder for your 6-digit login password, then sign in below. You can change your password anytime in your Profile.
                  </p>
                </div>
                <ActionButton
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Return to Sign In
                </ActionButton>
              </div>
            ) : (
              <ActionForm onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C] transition-all"
                    placeholder="partner@agency.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    disabled={forgotLoading}
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <ActionButton
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                    disabled={forgotLoading}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send 6-Digit Password →</span>
                    )}
                  </ActionButton>
                </div>

                <div className="pt-2 text-center">
                  <ActionButton
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-xs text-slate-500 hover:text-[#D99A1C] font-bold underline transition-colors cursor-pointer"
                  >
                    ← Back to Login Page
                  </ActionButton>
                </div>
              </ActionForm>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
