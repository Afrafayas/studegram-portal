import React from 'react';

export default function Sidebar({ activePage, setActivePage, onLogout, isOpen, onClose }) {
  const mainItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { id: 'ApplicationHistory', label: 'Application History', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'Universities', label: 'Universities', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'SearchCourses', label: 'Search Courses', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }
  ];

  const resourceItems = [
    { id: 'Notice', label: 'Notice', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'Webinar', label: 'Webinar', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'KnowledgeHub', label: 'Knowledge Hub', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'Scholarships', label: 'Scholarships', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z' },
    { id: 'UniversityDeadline', label: 'University Deadline', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  const renderNavButton = (item) => {
    const isActive = activePage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          setActivePage(item.id);
          if (onClose) onClose();
        }}
        className={`w-[calc(100%-16px)] flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 my-0.5 text-left text-xs font-bold select-none transition-all duration-150 ${
          isActive
            ? 'bg-gradient-to-r from-[#D99A1C] to-[#F5B025] text-black shadow-md'
            : 'text-[#94A3B8] hover:bg-[#1A1A2E] hover:text-white'
        }`}
      >
        <svg
          className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-black' : 'text-[#94A3B8]'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
        </svg>
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar drawer container */}
      <div className={`fixed inset-y-0 left-0 z-50 md:z-30 md:static w-[240px] min-w-[240px] bg-[#0A0A0F] h-screen md:h-[calc(100vh-60px)] md:sticky md:top-[60px] overflow-y-auto flex flex-col justify-between py-4 select-none text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        
        <div className="flex flex-col gap-6">
          {/* MAIN section */}
          <div>
            <span className="px-6 block text-[9px] font-extrabold text-[#475569] uppercase tracking-wider mb-2">MAIN</span>
            <div className="flex flex-col">
              {mainItems.map(renderNavButton)}
            </div>
          </div>

          {/* RESOURCES section */}
          <div>
            <span className="px-6 block text-[9px] font-extrabold text-[#475569] uppercase tracking-wider mb-2">RESOURCES</span>
            <div className="flex flex-col">
              {resourceItems.map(renderNavButton)}
            </div>
          </div>
        </div>

        {/* Support & Agent wrapper */}
        <div className="mt-auto flex flex-col gap-2 mx-2 border-t border-white/5 pt-3">
          {/* Bottom Agent Section */}
          <div className="px-4 py-3 flex items-center justify-between bg-white/5 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-bold text-black text-xs shrink-0">
                JD
              </div>
              <div className="text-left max-w-[100px]">
                <p className="text-xs font-bold text-white leading-tight truncate">John Doe</p>
                <p className="text-[9px] text-[#64748B] font-medium leading-tight truncate mt-0.5">Recruitment Agent</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-[#94A3B8] hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg" title="Settings">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  if (onLogout) onLogout();
                  if (onClose) onClose();
                }}
                className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1 hover:bg-white/5 rounded-lg" 
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Application Support Card */}
          <div className="px-4 py-3 bg-[#050508] border border-white/5 rounded-xl flex flex-col gap-1">
            <span className="text-[9px] font-extrabold text-[#475569] uppercase tracking-wider">Application Support</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">Sarah Johnson</span>
              <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
                <svg className="w-3.5 h-3.5 text-[#D99A1C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">+44 20 7946 0958</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
