import React from 'react';

export default function Notice() {
  const notices = [
    { id: 1, title: 'September 2026 Intake Documents Submission Deadline Extended', date: '23 Jun 2026', type: 'Urgent', isNew: true },
    { id: 2, title: 'New English Proficiency Waiver policy for Anglia Ruskin University starting today', date: '18 Jun 2026', type: 'Policy', isNew: true },
    { id: 3, title: 'Maintenance Requirement changes for UK Student Visas - Guidance Updates', date: '12 Jun 2026', type: 'Regulation', isNew: false },
    { id: 4, title: 'Pre-CAS Interviews schedule changes for Coventry University student cohort', date: '08 Jun 2026', type: 'Event', isNew: false },
    { id: 5, title: 'Scholarship Opportunities for Outstanding Indian Students - Academic Year 2026-2027', date: '02 Jun 2026', type: 'Scholarship', isNew: false },
    { id: 6, title: 'Important System Maintenance Notice: Studegram Portal downtime on 5th June 2026', date: '30 May 2026', type: 'System', isNew: false },
    { id: 7, title: 'University of Surrey webinar on English language preparations and IELTS test requirements', date: '24 May 2026', type: 'Webinar', isNew: false }
  ];

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Notices & Announcements</h1>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Stay updated with critical notifications and deadlines.</p>
      </div>

      {/* Notices Cards List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white border-l-4 border-l-[#6366F1] border-y border-r border-[#E2E8F0] rounded-r-xl rounded-l-md p-5 shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Notice Type Tag */}
                <span className="bg-slate-100 text-[#64748B] border border-slate-200 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  {notice.type}
                </span>
                
                {/* New Badge */}
                {notice.isNew && (
                  <span className="bg-indigo-50 text-[#6366F1] border border-indigo-100 text-[8px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse">
                    New
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-[#0F172A] leading-relaxed group-hover:text-[#6366F1] transition-colors cursor-pointer pr-12">
                {notice.title}
              </h3>

              <p className="text-[10px] text-[#64748B] font-semibold">Ref: N-{notice.id}092 • Posted by Admin</p>
            </div>

            {/* Right Date Chip */}
            <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
              <span className="bg-slate-100 text-[#0F172A] text-[9px] font-bold px-2.5 py-1 rounded-lg">
                {notice.date}
              </span>
              <button className="text-xs text-[#6366F1] font-semibold hover:underline flex items-center gap-1">
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
        <span>Showing 1-7 of 17 notices</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5 font-bold" disabled>
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm flex items-center gap-1.5 font-bold">
            Next
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
