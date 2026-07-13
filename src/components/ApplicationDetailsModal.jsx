import React, { useState } from 'react';

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

  const [activeTab, setActiveTab] = useState('profile');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    {
      author: 'Studegram Support Team',
      role: 'Senior Processor',
      text: 'Academic transcript and passport bio-page have been verified. Sent application files to University of Surrey Admissions team.',
      date: '18 Jun 2026, 11:30 AM',
      avatarColor: 'bg-indigo-500'
    },
    {
      author: 'Agent Helpdesk',
      role: 'Support Representative',
      text: 'Verified IELTS score sheet online (TRF code matching). Academic requirement checklist ticked.',
      date: '12 Jun 2026, 04:15 PM',
      avatarColor: 'bg-emerald-500'
    },
    {
      author: 'System Audit',
      role: 'Automation',
      text: 'Application created successfully. Generated unique identifier ' + application.camsId + '.',
      date: application.dateAdded + ', 09:00 AM',
      avatarColor: 'bg-slate-400'
    }
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const timeString = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const addedNote = {
      author: 'You (Agent)',
      role: 'Sub-Agent / Manager',
      text: newNote.trim(),
      date: timeString,
      avatarColor: 'bg-orange-500'
    };

    setNotes((prev) => [addedNote, ...prev]);
    setNewNote('');
  };

  // Build standard list of documents with status
  const documentChecklist = [
    { name: 'Passport Bio-Page', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'Higher Secondary School Certificate (12th)', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'Bachelor Academic Transcript', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'IELTS Academic Score Sheet', status: 'Verified', date: '12 Jun 2026', type: 'PDF' },
    { name: 'Statement of Purpose (SOP)', status: 'Pending Review', date: '15 Jun 2026', type: 'DOCX' },
    { name: 'Letter of Recommendation (LOR 1 & 2)', status: 'Pending Review', date: '15 Jun 2026', type: 'PDF' }
  ];

  // Helper to map primary/secondary status to timeline active step
  const getTimelineStep = () => {
    if (application.secondaryStatus === 'Offer Issued') return 3; // Step index 3: Offer Letter
    if (application.primaryStatus === 'Processed') return 2; // Step index 2: Sent to University
    return 1; // Step index 1: Docs Verified
  };

  const currentStepIndex = getTimelineStep();

  // Definition of workflow steps
  const timelineSteps = [
    { label: 'Application Submitted', desc: 'Agent filed application on portal', date: application.dateAdded },
    { label: 'Document Verification', desc: 'Studegram team verified eligibility checklists', date: '12 Jun 2026' },
    { label: 'Sent to University', desc: 'Application files forwarded to admissions office', date: '18 Jun 2026' },
    { label: 'Offer Letter Issued', desc: 'Conditional or Unconditional Offer received', date: application.secondaryStatus === 'Offer Issued' ? '20 Jun 2026' : null },
    { label: 'CAS Released', desc: 'Confirmation of Acceptance for Studies issued', date: null },
    { label: 'Visa Filed', desc: 'Student visa slots booked and application submitted', date: null },
    { label: 'Visa Decision', desc: 'Visa application outcome from embassy', date: null }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Modal Container: max-w-4xl (padding 24px/32px) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 transform scale-100"
      >
        {/* Top Header & close button */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Application details for {application.studentName}
              </h2>
              <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
                CAMS ID: <span className="text-[#D99A1C] font-bold">{application.camsId}</span> &middot; Passport: <span className="font-bold text-[#0F172A]">{application.passportNo}</span>
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

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row min-h-0 bg-slate-50/50">
          {/* Left Column: Progress Timeline Stepper */}
          <div className="md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white">
            <h3 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-5">
              Application Progress Timeline
            </h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isUpcoming = idx > currentStepIndex;

                let iconBg = 'bg-slate-200';
                let iconBorder = 'border-transparent';

                if (isCompleted) {
                  iconBg = 'bg-emerald-500';
                  iconBorder = 'border-emerald-500';
                } else if (isCurrent) {
                  iconBg = 'bg-indigo-600';
                  iconBorder = 'border-indigo-100 ring-4 ring-indigo-50';
                }

                return (
                  <div key={idx} className="relative flex gap-4 text-left">
                    {/* Stepper Dot */}
                    <span 
                      className={`absolute -left-[20.5px] top-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white z-10 transition-all duration-300 border ${iconBg} ${iconBorder}`}
                    >
                      {isCompleted && '✓'}
                      {isCurrent && '●'}
                    </span>

                    {/* Step Content */}
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold transition-colors ${isCompleted ? 'text-slate-800' : isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-normal max-w-xs font-medium">
                        {step.desc}
                      </p>
                      {step.date && (
                        <span className="inline-block text-[9px] text-slate-400 font-bold mt-1 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                          📅 {step.date}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tabbed Details Section */}
          <div className="flex-grow flex flex-col min-w-0">
            {/* Tabs Bar */}
            <div className="flex bg-white border-b border-slate-100 px-6">
              {[
                { id: 'profile', label: 'Student Profile' },
                { id: 'documents', label: 'Uploaded Documents' },
                { id: 'notes', label: 'Activity Logs & Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 font-bold text-xs border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#D99A1C] text-[#D99A1C]'
                      : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* Tab 1: Profile View */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Course Details Card */}
                  <div className="bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 border border-indigo-100/50 rounded-xl p-4.5 space-y-3">
                    <h4 className="text-[10px] font-extrabold text-[#D99A1C] uppercase tracking-wider flex items-center gap-1.5">
                      🎓 Application Choice
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">University</span>
                        <span className="text-xs font-bold text-[#0F172A]">{application.universityName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Course Program</span>
                        <span className="text-xs font-bold text-[#0F172A] leading-relaxed">{application.courseName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Requested Intake</span>
                        <span className="text-xs font-bold text-[#0F172A]">{application.intake || 'September 2026'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Application Status</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[8px] font-extrabold rounded-full uppercase">
                            {application.primaryStatus}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-extrabold rounded-full uppercase">
                            {application.secondaryStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Personal Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">
                      Student Personal Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Full Name</span>
                        <span className="text-xs font-bold text-[#0F172A]">{application.studentName}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Passport Number</span>
                        <span className="text-xs font-bold text-[#0F172A]">{application.passportNo}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Email Address</span>
                        <span className="text-xs font-semibold text-[#D99A1C] underline cursor-pointer">
                          {application.studentName.toLowerCase().replace(/\s+/g, '')}@example.com
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">WhatsApp Contact</span>
                        <span className="text-xs font-bold text-[#0F172A]">+91 9961624063</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Date of Birth</span>
                        <span className="text-xs font-bold text-[#0F172A]">18 June 2003</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Gender</span>
                        <span className="text-xs font-bold text-[#0F172A]">Male</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Resident Address</span>
                        <span className="text-xs font-medium text-slate-700 leading-relaxed block">
                          House No 24, Oasis Villa, Hill View Road, Calicut, Kerala - 673001, India
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Document Checklist */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      Required Documents Checklist
                    </h4>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      4 of 6 Verified
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-xl overflow-hidden shadow-sm">
                    {documentChecklist.map((doc, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-base">
                            {doc.type === 'PDF' ? '📄' : '📝'}
                          </span>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">{doc.name}</h5>
                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                              Uploaded: {doc.date} &middot; Format: {doc.type}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          doc.status === 'Verified' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Interactive Notes & Support Communication Log */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Note Input Box */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      placeholder="Add a progress update, ask helpdesk, or submit details..."
                      rows="2.5"
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] transition-all resize-none shadow-inner"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNote.trim()}
                        className="bg-[#D99A1C] hover:bg-[#C28410] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
                      >
                        Post Note
                      </button>
                    </div>
                  </form>

                  {/* Notes Timeline Stream */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">
                      Communication Stream & Audit Logs
                    </h4>
                    
                    <div className="space-y-4">
                      {notes.map((note, idx) => (
                        <div key={idx} className="flex gap-3 bg-white p-3.5 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          {/* Avatar Circle */}
                          <div className={`w-8 h-8 rounded-full ${note.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm`}>
                            {note.author[0]}
                          </div>
                          {/* Message Body */}
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <h5 className="text-xs font-bold text-slate-800">{note.author}</h5>
                              <span className="text-[9px] text-[#D99A1C] font-extrabold uppercase tracking-wider bg-indigo-50/50 px-1.5 py-0.2 rounded border border-indigo-100/50">
                                {note.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              {note.text}
                            </p>
                            <span className="block text-[8px] text-slate-400 font-bold select-none mt-1">
                              🕒 {note.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
