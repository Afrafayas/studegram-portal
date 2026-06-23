import React, { useState } from 'react';

export default function Register({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit number';
    }

    if (!agencyName.trim()) newErrors.agencyName = 'Agency name is required';

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Registration successful! Please sign in with your credentials.');
      onNavigate('login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-stretch select-none">
      
      {/* Left side (50%): Brand detail gradient panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        {/* Logo Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white text-[#6366F1] flex items-center justify-center font-extrabold text-xl shadow-lg">
            S
          </div>
          <span className="font-extrabold text-2xl tracking-wider uppercase">Studegram</span>
        </div>

        {/* Center: Hero text */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Join Studegram Today
          </h2>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Create an agency partner account to manage application pipelines, check real-time deadlines, and search university programs easily.
          </p>

          {/* 3 Feature Points */}
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

        {/* Footer */}
        <div className="text-[10px] text-white/60 font-semibold relative z-10">
          © 2026 Studegram Inc. All rights reserved.
        </div>
      </div>

      {/* Right side (50%): Form card centered */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-8 space-y-6 my-8">
          
          {/* Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Create Account</h1>
            <p className="text-xs text-[#64748B] font-semibold">Join Studegram today to process enrollments</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.fullName ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                  }`}
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  autoComplete="username"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                  }`}
                  placeholder="name@agency.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.email}</p>}
            </div>

            {/* Phone Number with country code +91 */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Phone Number</label>
              <div className="flex gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] select-none flex items-center shrink-0">
                  +91
                </div>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                      errors.phoneNumber ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                    }`}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {errors.phoneNumber && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.phoneNumber}</p>}
            </div>

            {/* Agency/Company Name */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Agency / Company Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.agencyName ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                  }`}
                  placeholder="Global Careers Ltd"
                  value={agencyName}
                  onChange={(e) => {
                    setAgencyName(e.target.value);
                    if (errors.agencyName) setErrors({ ...errors, agencyName: '' });
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.agencyName && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.agencyName}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A]"
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
              {errors.password && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.confirmPassword ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#6366F1]'
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A]"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.confirmPassword}</p>}
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors leading-tight">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#6366F1] border-slate-300 focus:ring-[#6366F1] mt-0.5 shrink-0"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                  }}
                  disabled={isLoading}
                />
                <span>I agree to the Terms and Conditions of Studegram</span>
              </label>
              {errors.agreeTerms && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:scale-[1.02] text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Bottom redirect */}
          <div className="text-center text-xs font-semibold text-[#64748B] pt-2">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#6366F1] font-bold hover:underline"
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
