import React, { useState } from 'react';

export default function AddApplicationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [stepNumber, setStepNumber] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    university: 'Anglia Ruskin University',
    passportCountry: 'India',
    intake: 'September/October 2026',
    
    // Step 3 Section 1
    firstName: '',
    lastName: '',
    passportExpiry: '',
    passportIssue: '',
    dob: '',
    gender: 'Male',
    state: '',
    city: '',
    whatsappCode: '+91',
    whatsappNumber: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    country: 'India',
    passportNo: '',
    email: '',
    previousRefusal: 'No',

    // Step 3 Section 2
    handlerEmail: '',
    handlerContactCode: '+91',
    handlerContact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStepNumber((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application submitted successfully to Studegram!');
    setStepNumber(1);
    onClose();
  };

  const currentCourseName = 'MSc in Computer Science (Artificial Intelligence)';
  const currentCourseType = 'Postgraduate';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Modal Container: max-w-lg, p-8 (padding 32px) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Top Header & X close button */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Add New Application
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator connected by progress line */}
        <div className="px-8 py-4 bg-slate-50/50 border-y border-slate-100">
          <div className="flex items-center justify-between max-w-xs mx-auto relative select-none">
            {/* Connector line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#6366F1] -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${((stepNumber - 1) / 2) * 100}%` }}
            ></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                stepNumber > 1
                  ? 'bg-[#6366F1] text-white'
                  : stepNumber === 1
                  ? 'border-2 border-[#6366F1] bg-white text-[#6366F1] ring-4 ring-indigo-50'
                  : 'border border-slate-200 bg-white text-[#64748B]'
              }`}>
                1
              </div>
              <span className="text-[9px] font-bold mt-1 text-[#64748B]">Course</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                stepNumber > 2
                  ? 'bg-[#6366F1] text-white'
                  : stepNumber === 2
                  ? 'border-2 border-[#6366F1] bg-white text-[#6366F1] ring-4 ring-indigo-50'
                  : 'border border-slate-200 bg-white text-[#64748B]'
              }`}>
                2
              </div>
              <span className="text-[9px] font-bold mt-1 text-[#64748B]">Eligibility</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                stepNumber > 3
                  ? 'bg-[#6366F1] text-white'
                  : stepNumber === 3
                  ? 'border-2 border-[#6366F1] bg-white text-[#6366F1] ring-4 ring-indigo-50'
                  : 'border border-slate-200 bg-white text-[#64748B]'
              }`}>
                3
              </div>
              <span className="text-[9px] font-bold mt-1 text-[#64748B]">Form</span>
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-8 flex-1">
          {/* STEP 1: Apply For New Course */}
          {stepNumber === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Apply For New Course</h3>
                <p className="text-[11px] text-[#64748B] font-semibold">Select the university and intake info to get started.</p>
              </div>

              <div className="space-y-4">
                {/* University Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">University</label>
                  <div className="relative">
                    <select
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="Anglia Ruskin University">Anglia Ruskin University</option>
                      <option value="University of Surrey">University of Surrey</option>
                      <option value="Coventry University">Coventry University</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Country of Student Passport Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Country of Passport</label>
                  <div className="relative">
                    <select
                      name="passportCountry"
                      value={formData.passportCountry}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="India">India</option>
                      <option value="Nepal">Nepal</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Intake Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Intake</label>
                  <div className="relative">
                    <select
                      name="intake"
                      value={formData.intake}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="September/October 2026">September/October 2026</option>
                      <option value="January/February 2027">January/February 2027</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indigo Continue button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[#6366F1] hover:bg-[#5053e3] hover:scale-[1.02] text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Eligibility & Documents */}
          {stepNumber === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">Eligibility & Documents</h3>
                <p className="text-[11px] text-[#64748B] font-semibold">Review checklists and requirements guidelines.</p>
              </div>

              {/* Amber warning banner */}
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3 text-xs">
                <svg className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="space-y-0.5">
                  <p className="font-extrabold uppercase tracking-wider text-[9px] text-[#F59E0B]">Important Note:</p>
                  <p className="leading-relaxed font-semibold">Please share your full immigration history including previous visa applications, CAS statements, and any official refusal notices (if any) to prevent visa refusal.</p>
                </div>
              </div>

              {/* Requirements sections with orange headings */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <h4 className="text-[10px] font-bold text-[#E85D2F] uppercase tracking-wider mb-1">Academic Requirement</h4>
                  <p className="text-[11px] text-[#64748B] font-semibold">No academic details available</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <h4 className="text-[10px] font-bold text-[#E85D2F] uppercase tracking-wider mb-1">English Requirement</h4>
                  <p className="text-[11px] text-[#64748B] font-semibold">No academic details available</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <h4 className="text-[10px] font-bold text-[#E85D2F] uppercase tracking-wider mb-1">Others Requirement</h4>
                  <p className="text-[11px] text-[#64748B] font-semibold">No academic details available</p>
                </div>
              </div>

              {/* Document Checklist */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider border-b border-slate-50 pb-1.5">Document Checklist</h4>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {[
                    'CV',
                    'SOP',
                    'Graduation Marksheets',
                    '2 LORs Work Experience Letter',
                    '12th For Bachelors only',
                    'Parent Consent Letter Under 18'
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-[#64748B] font-bold">
                      <svg className="w-3.5 h-3.5 text-[#10B981] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indigo Continue button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[#6366F1] hover:bg-[#5053e3] hover:scale-[1.02] text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: Application Form */}
          {stepNumber === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header metadata bar */}
              <div className="bg-[#0A0A0F] text-white p-4 rounded-xl space-y-2 text-[10px] font-semibold">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-[#64748B]">University:</span>
                  <span className="text-white truncate max-w-[180px]">{formData.university}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-[#64748B]">Course:</span>
                  <span className="text-white truncate max-w-[180px]">{currentCourseName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-[#64748B]">Intake:</span>
                  <span className="text-white">{formData.intake}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Type:</span>
                  <span className="text-white">{currentCourseType}</span>
                </div>
              </div>

              {/* Section 1: Student Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <span className="w-4 h-4 bg-[#6366F1] text-white text-[9px] font-bold rounded-full flex items-center justify-center">1</span>
                  <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Student Personal Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* First Name */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white" />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white" />
                  </div>

                  {/* Passport Expiry Date */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Passport Expiry</label>
                    <input required type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* Passport Issue Date */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Issue Date</label>
                    <input required type="date" name="passportIssue" value={formData.passportIssue} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">DOB</label>
                    <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* Gender Select */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Gender</label>
                    <div className="relative">
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer appearance-none">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">State</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* City */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>

                  {/* WhatsApp */}
                  <div className="col-span-2">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <div className="flex gap-2">
                      <select name="whatsappCode" value={formData.whatsappCode} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer">
                        <option value="+91">+91 (IN)</option>
                        <option value="+44">+44 (UK)</option>
                      </select>
                      <input required type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" placeholder="WhatsApp Number" />
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="col-span-2">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Address Line 1</label>
                    <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* Address Line 2 */}
                  <div className="col-span-2">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Address Line 2</label>
                    <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Pincode</label>
                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* Country Select */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Country</label>
                    <div className="relative">
                      <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer appearance-none">
                        <option value="India">India</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Passport No */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Passport No</label>
                    <input required type="text" name="passportNo" value={formData.passportNo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Email ID</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" />
                  </div>

                  {/* Previous Visa Refusal select */}
                  <div className="col-span-2">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Visa Refusal</label>
                    <div className="relative">
                      <select name="previousRefusal" value={formData.previousRefusal} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer appearance-none">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Other Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <span className="w-4 h-4 bg-[#6366F1] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
                  <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Other Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email of person handling application */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Handler Email</label>
                    <input required type="email" name="handlerEmail" value={formData.handlerEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" placeholder="handler@agency.com" />
                  </div>
                  {/* Contact No with +91 code */}
                  <div>
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Handler Phone</label>
                    <div className="flex gap-2">
                      <select name="handlerContactCode" value={formData.handlerContactCode} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer">
                        <option value="+91">+91</option>
                        <option value="+44">+44</option>
                      </select>
                      <input required type="tel" name="handlerContact" value={formData.handlerContact} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1]" placeholder="Contact number" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Upload Documents */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <span className="w-4 h-4 bg-[#6366F1] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
                  <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Upload Documents</h4>
                </div>

                {/* Dashed indigo border dropzone with cloud icon */}
                <div className="border-2 border-dashed border-[#6366F1]/50 hover:border-[#6366F1] rounded-xl p-6 bg-indigo-50/10 hover:bg-indigo-50/30 text-center transition-all duration-200 cursor-pointer select-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2.5 bg-white rounded-full shadow-sm text-[#6366F1] border border-indigo-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Drag and drop or click to upload</p>
                      <p className="text-[9px] text-[#64748B] font-semibold mt-0.5">PDF, JPEG, or PNG files up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full width indigo to cyan gradient Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:scale-[1.02] text-white font-bold py-3 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-6"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
