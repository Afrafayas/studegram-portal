import React, { useState } from 'react';

export default function ScholarshipDetailsModal({ isOpen, onClose, scholarship }) {
  if (!isOpen || !scholarship) return null;

  const [activeTab, setActiveTab] = useState('eligibility'); // eligibility, documents, steps

  // Standard documents required for scholarship applications
  const requiredDocs = [
    { name: 'Scholarship Application Form', desc: 'Completed and signed form matching the target scholarship category.', type: 'PDF' },
    { name: 'University Admission Offer Letter', desc: 'Copy of unconditional/conditional admission offer showing applicant details.', type: 'PDF' },
    { name: 'Statement of Purpose (SOP)', desc: 'Dedicated 500-word essay explaining why you deserve the scholarship and your career path.', type: 'PDF/Word' },
    { name: 'Academic References (2 LORs)', desc: 'Letters from high school counselors, principals, or university professors.', type: 'PDF' },
    { name: 'Updated Curriculum Vitae (CV)', desc: 'Listing all academic accomplishments, leadership roles, and community projects.', type: 'PDF' }
  ];

  // Dynamic status based on deadline date (current date: 2026-07-11)
  const getDeadlineStatus = (deadlineStr) => {
    const today = new Date('2026-07-11');
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString('en-US', options);

    if (diffDays < 0) {
      return { text: `Expired on ${formattedDate}`, color: 'text-red-700 bg-red-50 border-red-100' };
    } else if (diffDays <= 60) {
      return { text: `Closing Soon: ${formattedDate}`, color: 'text-red-600 bg-red-50 border-red-100' };
    } else if (diffDays <= 120) {
      return { text: `Open (Apply by ${formattedDate})`, color: 'text-amber-700 bg-amber-50 border-amber-100' };
    } else {
      return { text: `Open (Apply by ${formattedDate})`, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
    }
  };

  const statusInfo = getDeadlineStatus(scholarship.deadline);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 transform scale-100"
      >
        {/* Top Header & close button */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Scholarship Information Directory
              </h2>
              <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                Details for: <span className="text-[#6366F1] font-bold">{scholarship.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-0 bg-slate-50/50">
          
          {/* Left Column: Summary Info Banner */}
          <div className="md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white flex flex-col justify-between">
            <div className="space-y-5">
              <div className={`bg-gradient-to-tr ${scholarship.gradient} p-5 rounded-2xl text-white space-y-2`}>
                <span className="text-[9px] bg-white/20 backdrop-blur-md text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {scholarship.type}
                </span>
                <h3 className="font-extrabold text-base leading-tight mt-1">{scholarship.name}</h3>
                <p className="text-[10px] text-white/80 font-bold">{scholarship.university}</p>
              </div>

              {/* Specifications table */}
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-[#64748B]">Destination Region</span>
                  <span className="text-[#0F172A] font-bold">{scholarship.country}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-[#64748B]">Award Category</span>
                  <span className="text-[#0F172A] font-bold">{scholarship.type}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-[#64748B]">Award Amount</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{scholarship.amount}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[#64748B]">Scholarship Status</span>
                  <span className={`px-2.5 py-0.5 rounded border text-[9px] font-extrabold uppercase tracking-wider ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Support Note */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-[11px] text-[#4F46E5] font-semibold leading-relaxed mt-6">
              💡 **Agent Guidance Note:** Ensure the student has secured an official admission offer letter from **{scholarship.university}** prior to submitting the formal scholarship request.
            </div>
          </div>

          {/* Right Column: Tab detail sheets */}
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Tab navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {[
                { id: 'eligibility', label: 'Eligibility & Criteria' },
                { id: 'documents', label: 'Required Documents' },
                { id: 'steps', label: 'Application Steps' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-3.5 text-xs font-bold border-b-2 select-none transition-all ${
                      isActive
                        ? 'border-[#6366F1] text-[#6366F1] bg-white'
                        : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Sheet */}
            <div className="p-6 flex-1 min-h-[300px]">
              
              {/* ELIGIBILITY TAB */}
              {activeTab === 'eligibility' && (
                <div className="space-y-5 text-xs font-semibold leading-relaxed">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Candidate Eligibility</h4>
                    <p className="text-[#64748B] text-[11px]">Academic requirements, national origin criteria, and performance benchmarks.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                    <p className="text-[#334155] leading-relaxed">
                      {scholarship.eligibility}
                    </p>
                  </div>

                  <div className="space-y-2 text-[#475569]">
                    <h5 className="text-[9px] font-extrabold text-[#0F172A] uppercase tracking-wider">Default Requirements:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Must hold an active application profile on the Studegram agent database.</li>
                      <li>Must qualify as an international student paying overseas tuition fees.</li>
                      <li>Excellent behavioral recommendations and zero visa refusal history.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Required Document Checklist</h4>
                    <p className="text-[#64748B] text-[11px]">Prepare the following document suite and upload to the student portal before deadlines.</p>
                  </div>

                  <div className="space-y-3">
                    {requiredDocs.map((doc, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 text-xs font-semibold">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          {doc.type}
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-[#0F172A] font-bold">{doc.name}</h5>
                          <p className="text-[10px] text-[#64748B] leading-relaxed font-semibold">{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPLICATION STEPS TAB */}
              {activeTab === 'steps' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider">Application Steps</h4>
                    <p className="text-[#64748B] text-[11px]">Follow this workflow sequence to apply for the scholarship program successfully.</p>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                    {[
                      { step: 'Step 1', title: 'Secure Academic Admission Offer', desc: 'Apply and receive a valid conditional or unconditional offer letter from the university.' },
                      { step: 'Step 2', title: 'Prepare Scholarship Document Suite', desc: 'Draft your Scholarship SOP, obtain LOR references, and organize your academic transcript files.' },
                      { step: 'Step 3', title: 'Access Scholarship Application Portal', desc: 'Use the university applicant login or submit via the dedicated regional sponsor portal.' },
                      { step: 'Step 4', title: 'File Application & Track Status', desc: 'Submit the application online and notify the Studegram processing desk to log reference numbers.' }
                    ].map((s, idx) => (
                      <div key={idx} className="relative flex gap-4 text-left text-xs font-semibold">
                        <span className="absolute -left-[20.5px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-indigo-600 bg-white z-10" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-[#6366F1] font-extrabold uppercase tracking-wider">{s.step}</span>
                          <h5 className="text-[#0F172A] font-bold leading-tight">{s.title}</h5>
                          <p className="text-[10px] text-[#64748B] leading-relaxed font-semibold">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
