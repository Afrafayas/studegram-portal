import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

  const toast = useToast();

  // Layout tabs state: 'details' (App Details) or 'activity' (Messages & Updates)
  const [mainTab, setMainTab] = useState('details');
  const [activeTab, setActiveTab] = useState('profile');

  const [localDocuments, setLocalDocuments] = useState([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadDocError, setUploadDocError] = useState('');
  const [uploadComment, setUploadComment] = useState('');

  useEffect(() => {
    if (application) {
      setLocalDocuments(application.documents || []);
      setUploadComment('');
    }
  }, [application]);

  // Chat State Hooks
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatFiles, setChatFiles] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const messagesEndRef = useRef(null);

  // File Constraints
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const loadChatMessages = async (silent = false) => {
    const token = localStorage.getItem('partner_token');
    if (!token || !application?.id) return;

    if (!silent) {
      setIsChatLoading(true);
    }
    
    try {
      const res = await API.get(`/applications/${application.id}/chat`);
      const data = res.data;
      setChatMessages(data.data || []);
      setIsUnauthorized(false);
      setChatError('');
    } catch (err) {
      if (err.response?.status === 403) {
        setIsUnauthorized(true);
        setChatError('Not authorized to access this application chat.');
      } else {
        console.error('Error loading application chat:', err);
        setChatError('Could not sync live messages.');
      }
    } finally {
      if (!silent) {
        setIsChatLoading(false);
      }
    }
  };

  // Poll for messages every 8 seconds when active on Messages tab
  useEffect(() => {
    let intervalId;
    if (isOpen && mainTab === 'activity' && application?.id) {
      loadChatMessages(false); // Initial load is non-silent

      intervalId = setInterval(() => {
        loadChatMessages(true); // Polling fetches are silent
      }, 8000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, mainTab, application?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (mainTab === 'activity') {
      scrollToBottom();
    }
  }, [chatMessages, mainTab]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (chatFiles.length + files.length > 5) {
      toast.error('You can only attach up to 5 documents per message.');
      return;
    }

    const oversized = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error(`The following file(s) exceed the 10MB size limit:\n${oversized.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join('\n')}`);
      return;
    }

    setChatFiles(prev => [...prev, ...files]);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() && chatFiles.length === 0) return;

    const token = localStorage.getItem('partner_token');
    if (!token || !application?.id) return;

    setIsChatSending(true);
    setChatError('');

    const formData = new FormData();
    formData.append('message', chatInput.trim() || 'Uploaded attachment(s)');
    chatFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      const res = await API.post(`/applications/${application.id}/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = res.data;
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to send message.');
      }

      setChatMessages((prev) => [...prev, data.data]);
      setChatInput('');
      setChatFiles([]);
    } catch (err) {
      if (err.response?.status === 403) {
        setIsUnauthorized(true);
        setChatError('Not authorized to send messages in this chat.');
      } else {
        console.error('Send message error:', err);
        setChatError(err.message || 'Error sending message. Connection failed.');
        toast.error(err.message || 'Error sending message. Please check your network connection.');
      }
    } finally {
      setIsChatSending(false);
    }
  };

  const [notes, setNotes] = useState([
    {
      author: 'Studegram Verification Team',
      role: 'Compliance',
      text: 'Verified passport bio-page and academic transcripts. Eligibility confirmed for admission processing.',
      date: '12 Jun 2026, 11:30 AM',
      avatarColor: 'bg-emerald-500'
    }
  ]);
  const [newNote, setNewNote] = useState('');

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

  const documentChecklist = [
    { name: 'Passport Bio-Page', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'Higher Secondary School Certificate (12th)', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'Bachelor Academic Transcript', status: 'Verified', date: '11 Jun 2026', type: 'PDF' },
    { name: 'IELTS Academic Score Sheet', status: 'Verified', date: '12 Jun 2026', type: 'PDF' },
    { name: 'Statement of Purpose (SOP)', status: 'Pending Review', date: '15 Jun 2026', type: 'DOCX' },
    { name: 'Letter of Recommendation (LOR 1 & 2)', status: 'Pending Review', date: '15 Jun 2026', type: 'PDF' }
  ];

  const currentAppStatus = application.status || application.secondaryStatus || 'Submitted';

  const getTimelineStepIndex = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('enrolled') || s.includes('closed')) return 6;
    if (s.includes('visa approved') || s.includes('approved')) return 5;
    if (s.includes('visa processing') || s.includes('visa filed') || s.includes('visa pending')) return 4;
    if (s.includes('cas') || s.includes('i-20')) return 3;
    if (s.includes('offer')) return 2;
    if (s.includes('review') || s.includes('verification') || s.includes('processed') || s.includes('sent')) return 1;
    return 0;
  };

  const currentStepIndex = getTimelineStepIndex(currentAppStatus);

  const findStatusDate = (keywords) => {
    if (!application.statusHistory || !Array.isArray(application.statusHistory)) return null;
    const historyItem = application.statusHistory.find(h => 
      keywords.some(kw => (h.status || '').toLowerCase().includes(kw))
    );
    if (historyItem && historyItem.updatedAt) {
      return new Date(historyItem.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return null;
  };

  const timelineSteps = [
    { 
      label: 'Application Submitted', 
      desc: 'Agent filed application on portal', 
      date: application.dateAdded || findStatusDate(['submitted', 'pending']) || 'Filed' 
    },
    { 
      label: 'Document Verification', 
      desc: 'Studegram team & admissions office reviewing eligibility', 
      date: findStatusDate(['review', 'verification', 'sent', 'processed']) 
    },
    { 
      label: 'Offer Letter Issued', 
      desc: 'Conditional or Unconditional Offer letter received from university', 
      date: findStatusDate(['offer']) 
    },
    { 
      label: 'CAS / I-20 Released', 
      desc: 'Confirmation of Acceptance for Studies issued', 
      date: findStatusDate(['cas', 'i-20']) 
    },
    { 
      label: 'Visa Processing / Filed', 
      desc: 'Student visa application submitted to embassy', 
      date: findStatusDate(['visa processing', 'visa filed', 'visa pending']) 
    },
    { 
      label: 'Visa Approved', 
      desc: 'Visa application approved by embassy', 
      date: findStatusDate(['visa approved', 'approved']) 
    },
    { 
      label: 'Enrolled / Closed', 
      desc: 'Student arrived & enrolled. Application completed and closed', 
      date: findStatusDate(['enrolled', 'closed']) 
    }
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
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

        {/* Brand Main Toggle Tab Bar */}
        <div className="flex bg-slate-50 border-b border-slate-200/80 px-6 py-2 gap-4">
          <button
            onClick={() => setMainTab('details')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              mainTab === 'details'
                ? 'bg-white text-[#D99A1C] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            📁 App Details
          </button>
          <button
            onClick={() => setMainTab('activity')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all relative ${
              mainTab === 'activity'
                ? 'bg-white text-[#D99A1C] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            💬 Messages & Activity
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Modal Main Content Container */}
        {mainTab === 'details' ? (
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
                      <span 
                        className={`absolute -left-[20.5px] top-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white z-10 transition-all duration-300 border ${iconBg} ${iconBorder}`}
                      >
                        {isCompleted && '✓'}
                        {isCurrent && '●'}
                      </span>

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
              {/* Sub-Tabs Bar */}
              <div className="flex bg-white border-b border-slate-100 px-6">
                {[
                  { id: 'profile', label: 'Student Profile' },
                  { id: 'documents', label: 'Uploaded Documents' }
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
                            {application.student?.email || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">WhatsApp Contact</span>
                          <span className="text-xs font-bold text-[#0F172A]">{application.student?.phone || 'N/A'}</span>
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

                    {application.notes && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-2">
                        <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                          📝 Application Notes / Comments
                        </h4>
                        <p className="text-xs font-semibold text-slate-805 whitespace-pre-wrap leading-relaxed">
                          {application.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Document Checklist */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                        Uploaded Documents List
                      </h4>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                        {localDocuments.length} Document(s)
                      </span>
                    </div>

                    {/* Additional File Uploader */}
                    <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#D99A1C] transition-colors rounded-xl p-4 text-center cursor-pointer relative bg-slate-50">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingDoc(true);
                          setUploadDocError('');
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await API.post('/upload', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const newDoc = { 
                              name: file.name, 
                              url: res.data.url,
                              comment: uploadComment.trim()
                            };
                            const updatedDocs = [...localDocuments, newDoc];
                            await API.put(`/applications/${application.id}`, { documents: updatedDocs });
                            setLocalDocuments(updatedDocs);

                            // Auto log in secure chat thread
                            try {
                              const chatMessageText = `📎 New Document Uploaded: "${file.name}"\nComment: ${uploadComment.trim() || 'No comments provided.'}`;
                              const chatFormData = new FormData();
                              chatFormData.append('message', chatMessageText);
                              await API.post(`/applications/${application.id}/chat`, chatFormData);
                            } catch (chatErr) {
                              console.warn('Failed to log document upload in chat:', chatErr.message);
                            }

                            setUploadComment('');
                          } catch (err) {
                            console.error('File upload failed:', err);
                            setUploadDocError('Failed to upload document. Please check your connection.');
                          } finally {
                            setIsUploadingDoc(false);
                          }
                        }}
                      />
                      <div className="space-y-1 text-slate-500">
                        <span className="text-lg">📤</span>
                        <p className="text-xs font-semibold text-slate-700">Click to upload additional document</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Attach any supporting file (PDF, PNG, JPG, Word)</p>
                      </div>
                    </div>

                    {/* Persistent Comment Area for new upload */}
                    <div className="space-y-1.5 mt-2 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl">
                      <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">
                        Comments / Notes
                      </label>
                      <textarea
                        rows="2"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A] resize-none shadow-sm"
                        placeholder="Type comment here first, then click box above to select and upload file..."
                        value={uploadComment}
                        onChange={(e) => setUploadComment(e.target.value)}
                      />
                    </div>

                    {isUploadingDoc && (
                      <p className="text-[10px] text-[#D99A1C] font-semibold animate-pulse">⏳ Uploading file, please wait...</p>
                    )}
                    {uploadDocError && (
                      <p className="text-[10px] text-red-500 font-semibold">❌ {uploadDocError}</p>
                    )}

                    <div className="divide-y divide-slate-100 border border-slate-100 bg-white rounded-xl overflow-hidden shadow-sm">
                      {localDocuments.length > 0 ? (
                        localDocuments.map((doc, idx) => (
                          <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors border-b last:border-b-0 border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="text-base text-amber-500">📄</span>
                              <div>
                                <h5 className="text-xs font-bold text-slate-800">{doc.name}</h5>
                                {doc.comment && (
                                  <p className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded font-semibold mt-1 inline-block">
                                    💬 {doc.comment}
                                  </p>
                                )}
                                <p className="text-[9px] text-slate-450 font-semibold mt-1">
                                  Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just Now'}
                                </p>
                              </div>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#D99A1C] hover:bg-[#F5B025] text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                            >
                              <span>View file</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                          ⚠️ No documents found. Upload one above.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Messages & Activity Tab Content: Dual Column Layout */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-50/50 overflow-hidden">
            {/* Left Column: Application Chat Thread */}
            <div className="md:w-7/12 flex flex-col h-[520px] md:h-auto min-h-0 bg-white border-b md:border-b-0 md:border-r border-slate-100 relative">
              {/* Chat Secure Banner Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                    Secure Conversation
                  </span>
                </div>

                <button
                  onClick={() => fetchChatMessages(false)}
                  disabled={isChatLoading || isUnauthorized}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-[9px] font-bold"
                  title="Manual refresh thread"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-slate-500 ${isChatLoading ? 'animate-spin text-[#D99A1C]' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                  </svg>
                  Sync Updates
                </button>
              </div>

              {/* Chat Message Box / Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 min-h-0">
                {chatError && !isUnauthorized && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-[11px] font-semibold text-center shadow-sm">
                    ⚠️ {chatError}
                  </div>
                )}

                {isUnauthorized ? (
                  /* 403 Unauthorized Warning UI State */
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-600 shadow-inner">
                      <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Secure Conversation Restricted
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold max-w-xs mt-1.5 leading-relaxed">
                        Access denied (403). You do not have permissions to access or send messages in the secure chat for this application.
                      </p>
                    </div>
                  </div>
                ) : isChatLoading && chatMessages.length === 0 ? (
                  /* Loading State spinner */
                  <div className="flex items-center justify-center h-full">
                    <svg className="animate-spin h-6 w-6 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : chatMessages.length === 0 ? (
                  /* Empty state message */
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 select-none">
                    <span className="text-3xl">💬</span>
                    <p className="text-xs font-bold text-slate-700">No Support Messages Yet</p>
                    <p className="text-[10px] text-slate-400 font-semibold max-w-xs leading-relaxed">
                      Start the conversation below to resolve any issues or queries about this student application with the support team.
                    </p>
                  </div>
                ) : (
                  /* Render Messages */
                  chatMessages.map((msg, index) => {
                    // System log check
                    if (msg.isSystemLog) {
                      return (
                        <div key={msg._id || index} className="flex justify-center my-3.5 px-4">
                          <div className="text-[9px] text-slate-500 font-extrabold bg-slate-100 border border-slate-200/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm max-w-full text-center uppercase tracking-wider select-none">
                            <span>ℹ️</span>
                            <span>{msg.message}</span>
                            <span className="text-[8px] text-slate-400 font-bold select-none">
                              &middot; {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    const isPartner = msg.senderModel === 'Partner';
                    const bubbleClass = isPartner
                      ? 'bg-gradient-to-r from-[#D99A1C] to-[#C28410] text-white rounded-l-xl rounded-tr-xl self-end ml-auto shadow-sm border border-amber-600/10'
                      : 'bg-slate-700 text-slate-100 rounded-r-xl rounded-tl-xl self-start mr-auto shadow-sm border border-slate-600';
                    
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col max-w-[85%] ${isPartner ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        {/* Header metadata */}
                        <div className="flex items-center gap-1.5 mb-1 px-1.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 select-none">
                          <span>{msg.sender?.name || (isPartner ? 'You' : 'Admin')}</span>
                          <span>&middot;</span>
                          <span className={isPartner ? 'text-[#D99A1C]' : 'text-slate-400'}>
                            {isPartner ? 'Agent' : 'Staff'}
                          </span>
                        </div>

                        {/* Message body text */}
                        <div className={`p-3 text-xs leading-relaxed font-medium ${bubbleClass}`}>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          
                          {/* Secure attachments file view */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2.5 space-y-1.5 border-t border-white/15 pt-2.5">
                              {msg.attachments.map((att, attIdx) => {
                                const filename = att.split('/').pop() || `document_${attIdx + 1}`;
                                return (
                                  <a
                                    key={attIdx}
                                    href={att}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all truncate hover:scale-[1.01] ${
                                      isPartner
                                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                                        : 'bg-slate-900/40 hover:bg-slate-900/60 text-slate-100 border-slate-600'
                                    }`}
                                  >
                                    <svg className="w-3.5 h-3.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="truncate max-w-[150px]">{filename}</span>
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[8px] text-slate-400 font-bold mt-1 px-1 select-none">
                          🕒 {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Previews in form */}
              {chatFiles.length > 0 && (
                <div className="bg-white px-4 py-2 border-t border-slate-100 flex flex-wrap gap-2 shrink-0">
                  {chatFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[9px] px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setChatFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 font-extrabold focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Chat Input Form */}
              <form 
                onSubmit={handleSendChatMessage} 
                className="bg-white p-3 border-t border-slate-100 flex items-center gap-2 shrink-0"
              >
                <div className="relative">
                  <input
                    type="file"
                    id="chat-file-upload"
                    multiple
                    disabled={isChatSending || isUnauthorized}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="chat-file-upload"
                    className={`p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#0F172A] rounded-xl border border-slate-200 transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                      (isChatSending || isUnauthorized) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                    }`}
                    title="Upload attachment (max 5 files, 10MB limit)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </label>
                </div>

                <input
                  type="text"
                  placeholder={
                    isUnauthorized 
                      ? "Conversation restricted..." 
                      : chatFiles.length > 0 
                        ? "Add details for uploaded file(s)..." 
                        : "Type message to resolve issues with admissions..."
                  }
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] transition-all disabled:opacity-50"
                  disabled={isChatSending || isUnauthorized}
                />

                <button
                  type="submit"
                  disabled={isChatSending || isUnauthorized || (!chatInput.trim() && chatFiles.length === 0)}
                  className="p-2.5 bg-gradient-to-r from-[#D99A1C] to-[#C28410] hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-white rounded-xl transition-all duration-150 flex items-center justify-center shadow-md disabled:pointer-events-none"
                >
                  {isChatSending ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Activity Logs & Notes */}
            <div className="md:w-5/12 p-6 flex flex-col min-h-0 bg-slate-50/30 overflow-y-auto">
              <div className="space-y-6">
                {/* Note Input Box */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    placeholder="Add a progress note or internal task description..."
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
                        <div className={`w-8 h-8 rounded-full ${note.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm`}>
                          {note.author[0]}
                        </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
