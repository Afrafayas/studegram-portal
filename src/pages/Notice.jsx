import React, { useState, useEffect } from 'react';
import { notices } from '../data/notices';

const CATEGORIES_LIST = [
  'Admission',
  'Urgent',
  'Policy',
  'Regulation',
  'Event',
  'Scholarship',
  'System',
  'Webinar',
  'Announcement'
];

export default function Notice({ selectedNoticeId, setSelectedNoticeId }) {
  // State for notices list
  const [localNotices, setLocalNotices] = useState(() => {
    const saved = localStorage.getItem('studegram_notices');
    if (saved) {
      return JSON.parse(saved);
    }
    return notices;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('studegram_notices', JSON.stringify(localNotices));
  }, [localNotices]);

  // Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState(CATEGORIES_LIST[0]);
  const [formBadge, setFormBadge] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  // Lock background scrolling when modal is open
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (showUploadModal) {
      document.body.style.overflow = 'hidden';
      if (mainElement) mainElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (mainElement) mainElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (mainElement) mainElement.style.overflow = '';
    };
  }, [showUploadModal]);

  // Handle Poster File Upload & Convert to Base64
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormPosterUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG/JPG).');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // Submit Notice Form
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newNotice = {
      id: `notice-${Date.now()}`,
      title: formTitle,
      message: formMessage,
      type: formType,
      badge: formBadge.trim() || null,
      date: dateStr,
      isNew: true,
      popup: false,
      image: formPosterUrl || null
    };

    setLocalNotices([newNotice, ...localNotices]);

    // Reset Form & Close Modal
    setFormTitle('');
    setFormType(CATEGORIES_LIST[0]);
    setFormBadge('');
    setFormMessage('');
    setFormPosterUrl('');
    setFileName('');
    setShowUploadModal(false);
  };

  // Single Notice Detail View Page
  if (selectedNoticeId) {
    const notice = localNotices.find((n) => n.id === selectedNoticeId);
    if (notice) {
      return (
        <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
          {/* Back Button and Header */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedNoticeId(null)}
              className="inline-flex items-center gap-1.5 text-xs text-[#D99A1C] font-bold hover:underline mb-2 self-start transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Notices
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Notice Details</h1>
            <p className="text-xs text-[#64748B] font-semibold mt-1">Detailed view of critical notification updates.</p>
          </div>

          {/* Premium Notice Detail Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 shadow-sm space-y-6 hover:shadow-md transition-shadow duration-200">
            {/* Badges & Date Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-[#64748B] border border-slate-200 text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase">
                  {notice.type}
                </span>
                {notice.badge && (
                  <span className="bg-indigo-50 text-[#D99A1C] border border-indigo-100 text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase">
                    {notice.badge}
                  </span>
                )}
                {notice.isNew && (
                  <span className="bg-indigo-50 text-[#D99A1C] border border-indigo-100 text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase animate-pulse">
                    New
                  </span>
                )}
              </div>
              <span className="bg-slate-100 text-[#0F172A] text-[10px] font-bold px-3 py-1 rounded-lg">
                Posted: {notice.date}
              </span>
            </div>

            {/* Notice Title */}
            <h2 className="text-xl font-bold text-[#0F172A] leading-snug">
              {notice.title}
            </h2>

            {/* Image Space */}
            {notice.image && (
              <div className="overflow-hidden rounded-2xl border border-slate-200/50 shadow-inner max-h-[380px] w-full bg-slate-50 flex items-center justify-center">
                <img
                  src={notice.image}
                  alt={notice.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Detailed Content */}
            <div className="space-y-4 text-sm text-[#334155] leading-relaxed font-medium">
              <p>{notice.message}</p>
            </div>

            {/* Metadata Footer */}
            <div className="pt-6 border-t border-slate-100 text-[10px] text-[#64748B] font-semibold flex items-center justify-between">
              <span>Ref: N-{notice.id}092 • Posted by Admin</span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Announcement
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  // Notices List View
  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Title & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Notices & Announcements</h1>
          <p className="text-xs text-[#64748B] font-semibold mt-1">Stay updated with critical notifications and deadlines.</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="self-start md:self-auto bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Post Notice / Upload Poster
        </button>
      </div>

      {/* Notices Cards List */}
      <div className="space-y-4">
        {localNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNoticeId(notice.id)}
            className="bg-white border-l-4 border-l-[#D99A1C] border-y border-r border-[#E2E8F0] rounded-r-xl rounded-l-md p-5 shadow-sm hover:shadow-md hover:scale-[1.005] active:scale-[0.998] transition-all duration-200 relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
          >
            {/* Left Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Notice Type Tag */}
                <span className="bg-slate-100 text-[#64748B] border border-slate-200 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  {notice.type}
                </span>

                {/* Notice Badge (if any) */}
                {notice.badge && (
                  <span className="bg-indigo-50 text-[#D99A1C] border border-indigo-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    {notice.badge}
                  </span>
                )}
                
                {/* New Badge */}
                {notice.isNew && (
                  <span className="bg-indigo-50 text-[#D99A1C] border border-indigo-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse">
                    New
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-[#0F172A] leading-relaxed group-hover:text-[#D99A1C] transition-colors pr-12">
                {notice.title}
              </h3>

              <p className="text-[10px] text-[#64748B] font-semibold">Ref: N-{notice.id}092 • Posted by Admin</p>
            </div>

            {/* Right Date Chip */}
            <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
              <span className="bg-slate-100 text-[#0F172A] text-[9px] font-bold px-2.5 py-1 rounded-lg">
                {notice.date}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNoticeId(notice.id);
                }}
                className="text-xs text-[#D99A1C] font-semibold hover:underline flex items-center gap-1"
              >
                Details
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination with prev/next buttons */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between text-xs text-[#64748B] font-semibold">
        <span>Showing 1-{localNotices.length} of {localNotices.length} notices</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5 font-bold" disabled>
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5 font-bold" disabled>
            Next
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add Notice Modal Sheet */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-6 text-white border-b border-slate-900 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold tracking-tight">Post Announcement / Upload Poster</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Publish critical updates and media directly to the portal feed.</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(100vh-160px)] overflow-y-auto">
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                {/* Notice Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Announcement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. September 2026 Intake Documents Submission Deadline Extended"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Category / Type *</label>
                    <div className="relative">
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none"
                      >
                        {CATEGORIES_LIST.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Custom Badge */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Accent Tag / Badge (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Critical, New Intake, Speed Boost"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                    />
                  </div>
                </div>

                {/* Announcement Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Message Description *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write details about the updates, policy guidelines, schedules, or steps..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                  ></textarea>
                </div>

                {/* Drag and Drop File Upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Announcement Poster / Image</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      dragOver ? 'border-[#D99A1C] bg-[#D99A1C]/5' : 'border-slate-300 bg-[#F8FAFC] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <input
                      type="file"
                      id="notice-file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="notice-file-upload" className="flex flex-col items-center cursor-pointer space-y-2 w-full text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-inner text-slate-500 mx-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">
                          {fileName ? `File Selected: ${fileName}` : 'Click to Upload or Drag Poster here'}
                        </p>
                        <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Supports PNG, JPG, JPEG (will be compressed locally)</p>
                      </div>
                    </label>
                  </div>

                  {/* Image Upload Preview */}
                  {formPosterUrl && (
                    <div className="pt-2">
                      <p className="text-[9px] font-extrabold text-[#475569] uppercase tracking-wider mb-1">Poster Preview:</p>
                      <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200">
                        <img src={formPosterUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#475569] py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01]"
                  >
                    Publish Notice Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
