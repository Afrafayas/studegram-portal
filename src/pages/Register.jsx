import React, { useState } from 'react';
import API from '../api/axios';

export default function Register({ onNavigate }) {
  // Wizard Window Steps: 1 = Personal Details, 2 = Company Details & Legal Upload, 3 = OTP Verification, 4 = Under Review
  const [step, setStep] = useState(1);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Company Details & Legal Document
  const [agencyName, setAgencyName] = useState('');
  const [partnerType, setPartnerType] = useState('Company');
  const [taxId, setTaxId] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');

  // Step 3: OTP Verification
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status & Errors
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // ==========================================
  // VALIDATIONS
  // ==========================================
  const validateStep1 = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Personal email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!place.trim()) newErrors.place = 'Place / Location is required';
    if (!address.trim()) newErrors.address = 'Full address is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!agencyName.trim()) newErrors.agencyName = 'Company / Agency name is required';
    if (!taxId.trim()) newErrors.taxId = 'Business Registration / Tax ID is required';
    if (!city.trim()) newErrors.city = 'City is required';

    // MANDATORY DOCUMENT CHECK
    if (documents.length === 0) {
      newErrors.documents = 'At least 1 legal company document upload is MANDATORY for agency registration.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [uploadingDoc, setUploadingDoc] = useState(false);

  // File Upload Handler for Mandatory Legal Documents
  const handleLegalDocFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrors({ ...errors, docAdd: 'File size exceeds 15MB limit.' });
      return;
    }

    setUploadingDoc(true);
    setErrors({ ...errors, docAdd: '' });

    try {
      let fileUrl = '';
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data?.success && (uploadRes.data.url || uploadRes.data.fileUrl)) {
          fileUrl = uploadRes.data.url || uploadRes.data.fileUrl;
        }
      } catch (uploadErr) {
        console.warn('File upload fallback to Base64 preview:', uploadErr.message);
      }

      if (!fileUrl) {
        fileUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const title = docName.trim() || file.name;
      const newDoc = {
        name: title,
        title: title,
        fileName: file.name,
        url: fileUrl,
        previewUrl: fileUrl,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadedAt: new Date().toISOString()
      };

      setDocuments(prev => [...prev, newDoc]);
      setDocName('');
      setErrors(prev => ({ ...prev, documents: '', docAdd: '' }));
    } catch (err) {
      console.error('File upload error:', err);
      setErrors(prev => ({ ...prev, docAdd: 'Failed to upload document file.' }));
    } finally {
      setUploadingDoc(false);
    }
  };

  // Move Step 1 -> Step 2
  const handleNextToCompanyDetails = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Move Step 2 -> Step 3 (Send OTP)
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const res = await API.post('/partners/send-otp', { email });
      if (res.data.success) {
        setOtpSent(true);
        setStep(3);
        window.scrollTo(0, 0);
      } else {
        throw new Error(res.data.message || 'Failed to send OTP email.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Error sending OTP email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await API.post('/partners/send-otp', { email });
      alert(`A new 6-digit OTP code has been sent to ${email}`);
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Final Registration (Step 3 -> Step 4)
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit OTP code sent to your email.' });
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // 1. Verify OTP
      const verifyRes = await API.post('/partners/verify-otp', { email, otp: otpCode.trim() });
      if (!verifyRes.data.success) {
        throw new Error(verifyRes.data.message || 'OTP verification failed');
      }

      // 2. Submit Final Partner Registration
      const regRes = await API.post('/partners/register', {
        name: fullName.trim(),
        email: email.trim(),
        phone: `+91${phoneNumber.trim()}`,
        place: place.trim(),
        address: address.trim(),
        companyName: agencyName.trim(),
        partnerType,
        taxId: taxId.trim(),
        country,
        city: city.trim(),
        password,
        documents
      });

      if (regRes.data.success) {
        setStep(4); // Under Review Window
      } else {
        throw new Error(regRes.data.message || 'Registration failed.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-stretch select-none">
      
      {/* Left side (50%): Brand detail graphic panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#D99A1C] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-multiply"
          style={{ backgroundImage: 'url(/assets/login_hero_pattern.png)' }}
        ></div>
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Logo Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white text-[#D99A1C] flex items-center justify-center font-extrabold text-xl shadow-lg">
            S
          </div>
          <span className="font-extrabold text-2xl tracking-wider uppercase">Studegram</span>
        </div>

        {/* Center: Hero text */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Agency Onboarding & Partnership
          </h2>
          <p className="text-xs text-white/90 font-medium leading-relaxed">
            Register your education agency with Studgram. Follow our 3-step verification process to upload legal credentials and submit for admin approval.
          </p>

          {/* Stepper Indicator */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${step >= 1 ? 'bg-white text-[#D99A1C]' : 'bg-white/20 text-white'}`}>1</span>
              <span className={step === 1 ? 'text-white font-extrabold underline' : 'text-white/80'}>Personal Details & Address</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${step >= 2 ? 'bg-white text-[#D99A1C]' : 'bg-white/20 text-white'}`}>2</span>
              <span className={step === 2 ? 'text-white font-extrabold underline' : 'text-white/80'}>Company Info & Mandatory Legal Document</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${step >= 3 ? 'bg-white text-[#D99A1C]' : 'bg-white/20 text-white'}`}>3</span>
              <span className={step === 3 ? 'text-white font-extrabold underline' : 'text-white/80'}>Email OTP Verification</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-white/60 font-semibold relative z-10">
          © 2026 Studegram Inc. All rights reserved.
        </div>
      </div>

      {/* Right side (50%): Wizard Form Window */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-8 space-y-6 my-6">
          
          {/* Top Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D99A1C] to-[#F5B025] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 text-xs shadow-sm">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-[10px] text-red-800 uppercase tracking-wider">Registration Error</p>
                <p className="leading-relaxed font-semibold">{apiError}</p>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* WINDOW 1: PERSONAL DETAILS                 */}
          {/* ========================================== */}
          {step === 1 && (
            <form onSubmit={handleNextToCompanyDetails} className="space-y-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-black text-[#D99A1C] uppercase tracking-wider">Step 1 of 3</span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Personal Details</h1>
                <p className="text-xs text-[#64748B] font-semibold">Enter your personal identity and contact information</p>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.fullName ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                  }`}
                  placeholder="e.g. Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Personal Email Address (For OTP verification) *</label>
                <input
                  type="email"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                  }`}
                  placeholder="owner@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.email}</p>}
              </div>

              {/* Phone & Place Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Phone Number *</label>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-bold text-[#0F172A] flex items-center shrink-0">+91</span>
                    <input
                      type="tel"
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                        errors.phoneNumber ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                      }`}
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Place / Location *</label>
                  <input
                    type="text"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                      errors.place ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                    }`}
                    placeholder="e.g. MG Road, Kochi"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                  />
                  {errors.place && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.place}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Personal / Office Address *</label>
                <textarea
                  rows="2"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.address ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                  }`}
                  placeholder="Enter full postal address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.address}</p>}
              </div>

              {/* Passwords Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full bg-slate-50 border rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                        errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                      }`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] focus:outline-none"
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

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full bg-slate-50 border rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                        errors.confirmPassword ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                      }`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] focus:outline-none"
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
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider mt-4"
              >
                Next: Company Details & Legal Upload →
              </button>
            </form>
          )}

          {/* ========================================== */}
          {/* WINDOW 2: COMPANY DETAILS & LEGAL UPLOAD   */}
          {/* ========================================== */}
          {step === 2 && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-black text-[#D99A1C] uppercase tracking-wider">Step 2 of 3</span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Company Details & Document</h1>
                <p className="text-xs text-[#64748B] font-semibold">Provide your registered company information and mandatory legal proof</p>
              </div>

              {/* Agency Name */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Company / Agency Name *</label>
                <input
                  type="text"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.agencyName ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                  }`}
                  placeholder="Global Overseas Careers Pvt Ltd"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
                {errors.agencyName && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.agencyName}</p>}
              </div>

              {/* Partner Type & Tax ID Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Entity Type *</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                  >
                    <option value="Company">Private Limited / LLP Company</option>
                    <option value="Individual">Individual Counselor / Sole Proprietorship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Business Reg / Tax ID *</label>
                  <input
                    type="text"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                      errors.taxId ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                    }`}
                    placeholder="GSTIN / Corporate Reg No."
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                  {errors.taxId && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.taxId}</p>}
                </div>
              </div>

              {/* Country & City Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Country *</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                      errors.city ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                    }`}
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && <p className="text-[10px] text-[#EF4444] font-bold mt-0.5">{errors.city}</p>}
                </div>
              </div>

              {/* MANDATORY LEGAL DOCUMENT UPLOAD BOX */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-[#0F172A] uppercase tracking-wider">
                    📜 Mandatory Company Legal Document Upload *
                  </label>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Mandatory</span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-tight">
                  Upload at least 1 official legal document (e.g., Certificate of Incorporation, GST Certificate, Business License or Trade Card).
                </p>

                {errors.documents && (
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-[11px] text-red-700 font-bold flex items-center gap-2">
                    <span>⚠️</span> <span>{errors.documents}</span>
                  </div>
                )}

                {/* Uploaded Documents List */}
                {documents.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-emerald-600 font-bold">📄</span>
                          <span className="font-bold text-[#0F172A] truncate">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Document input inline file picker */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                      Document Title (Optional Name)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                      placeholder="e.g. GST Registration Certificate / Incorporation Proof"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                    />
                  </div>

                  <div className="border-2 border-dashed border-slate-200 hover:border-[#D99A1C] transition-colors rounded-xl p-4 text-center relative bg-white cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleLegalDocFileUpload}
                      disabled={uploadingDoc}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1">
                      {uploadingDoc ? (
                        <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                          <svg className="animate-spin h-6 w-6 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <p className="text-xs font-bold text-[#D99A1C] animate-pulse">Uploading legal document...</p>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl block">📤</span>
                          <p className="text-xs font-bold text-[#0F172A]">Click to select legal document file</p>
                          <p className="text-[10px] text-slate-400 font-semibold">PDF, DOCX, PNG, JPG up to 15MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {errors.docAdd && <p className="text-[10px] text-rose-500 font-bold">{errors.docAdd}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploadingDoc}
                  className="w-2/3 bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isLoading ? 'Sending Email OTP...' : 'Next: Verify Email OTP →'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================== */}
          {/* WINDOW 3: EMAIL OTP VERIFICATION           */}
          {/* ========================================== */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-black text-[#D99A1C] uppercase tracking-wider">Step 3 of 3</span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Enter Email OTP</h1>
                <p className="text-xs text-[#64748B] font-semibold">
                  A 6-digit verification OTP code has been sent to your email: <strong className="text-[#0F172A]">{email}</strong>
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-bold text-[10px] uppercase text-amber-800 tracking-wider">OTP Verification</p>
                <p className="leading-relaxed">Please check your inbox or spam folder for the 6-digit verification code.</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">6-Digit OTP Code *</label>
                <input
                  type="text"
                  maxLength="6"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-center text-xl font-extrabold tracking-[8px] text-[#0F172A] placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-1 transition-all ${
                    errors.otp ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-slate-200 focus:ring-[#D99A1C]'
                  }`}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    if (errors.otp) setErrors({ ...errors, otp: '' });
                  }}
                />
                {errors.otp && <p className="text-[10px] text-[#EF4444] font-bold text-center mt-1">{errors.otp}</p>}
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-xs text-[#D99A1C] font-extrabold hover:underline"
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isLoading ? 'Verifying OTP & Submitting...' : 'Verify & Submit Registration'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================== */}
          {/* WINDOW 4: UNDER REVIEW MODE                */}
          {/* ========================================== */}
          {step === 4 && (
            <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in duration-200">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-amber-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-300">
                  Registration Under Review
                </span>
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Onboarding Received</h1>
                <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                  Thank you for registering <strong>{agencyName}</strong>! Your legal documents and company details have been submitted and are currently <strong>Under Review</strong> by the Studgram Admin team.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-700">
                <p className="font-bold text-[#0F172A]">What happens next?</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium text-slate-600">
                  <li>Studgram Admin verifies your uploaded legal company documents.</li>
                  <li>Upon approval, you will receive an automated confirmation email.</li>
                  <li>Once approved, you will get full access to add students and submit applications.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md uppercase tracking-wider"
              >
                Back to Sign In Page
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
