import React, { useState } from 'react';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and loading states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (!validateForm()) return;

    setIsLoading(true);

    // Mock network loading state for premium feel
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-stretch select-none">
      
      {/* Left side (50%): Brand detail graphic panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#D99A1C] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Transparent Icon Pattern Background with custom opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-multiply"
          style={{ backgroundImage: 'url(/assets/login_hero_pattern.png)' }}
        ></div>
        {/* Soft layout overlay */}
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Top: Logo Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white text-[#D99A1C] flex items-center justify-center font-extrabold text-xl shadow-lg">
            S
          </div>
          <span className="font-extrabold text-2xl tracking-wider uppercase">Studegram</span>
        </div>

        {/* Center: Hero Statement */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Empowering Student Journeys Worldwide
          </h2>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Manage student records, track university deadlines, search thousands of academic courses, and file applications in one unified dashboard.
          </p>

          {/* Cute Elephant SVG */}
          <div className="py-2">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Back Legs */}
              <rect x="22" y="52" width="8" height="16" rx="4" fill="#64748B" />
              <rect x="42" y="52" width="8" height="16" rx="4" fill="#64748B" />
              {/* Body */}
              <circle cx="35" cy="42" r="20" fill="#94A3B8" />
              {/* Head */}
              <circle cx="52" cy="38" r="14" fill="#94A3B8" />
              {/* Front Legs */}
              <rect x="28" y="52" width="8" height="16" rx="4" fill="#94A3B8" />
              <rect x="48" y="52" width="8" height="16" rx="4" fill="#94A3B8" />
              {/* Ear */}
              <circle cx="46" cy="34" r="6" fill="#F1F5F9" />
              <circle cx="46" cy="34" r="4" fill="#F472B6" />
              {/* Eye */}
              <circle cx="56" cy="34" r="1.5" fill="#0F172A" />
              {/* Trunk curling right */}
              <path d="M 64 42 C 72 42 76 46 76 50 C 76 54 72 54 70 51" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Tail */}
              <path d="M 16 42 Q 10 40 12 46" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* 3 Feature Points with checkmarks */}
          <div className="space-y-3.5 pt-6 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Manage Student Applications</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Search 100k+ Active Courses</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Track Deadlines and Schedules</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer copyright */}
        <div className="text-[10px] text-white/60 font-semibold relative z-10">
          © 2026 Studegram Inc. All rights reserved.
        </div>
      </div>

      {/* Right side (50%): Form card centered */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-8 md:p-10 space-y-8">
          
          {/* Form Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Welcome back</h1>
            <p className="text-xs text-[#64748B] font-semibold">Sign in to your account to manage applications</p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    emailError
                      ? 'border-[#EF4444] focus:ring-[#EF4444] focus:border-[#EF4444]'
                      : 'border-slate-200 focus:ring-[#D99A1C] focus:border-[#D99A1C]'
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
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    passwordError
                      ? 'border-[#EF4444] focus:ring-[#EF4444] focus:border-[#EF4444]'
                      : 'border-slate-200 focus:ring-[#D99A1C] focus:border-[#D99A1C]'
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] focus:outline-none"
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
                </button>
              </div>
              {passwordError && (
                <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{passwordError}</p>
              )}
            </div>

            {/* Remember me & Forgot password row */}
            <div className="flex items-center justify-between text-xs select-none">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#D99A1C] border-slate-300 focus:ring-[#D99A1C]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Remember me
              </label>
              <a href="#" className="text-[#D99A1C] font-bold hover:underline">Forgot password?</a>
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.02] text-white font-bold py-3 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Bottom redirection */}
          <div className="text-center text-xs font-semibold text-[#64748B] pt-2">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#D99A1C] font-bold hover:underline"
              disabled={isLoading}
            >
              Register here
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
