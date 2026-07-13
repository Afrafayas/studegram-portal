import React from 'react';
import { notices } from '../data/notices';

export default function Notice({ selectedNoticeId, setSelectedNoticeId }) {
  // Single Notice Detail View Page
  if (selectedNoticeId) {
    const notice = notices.find((n) => n.id === selectedNoticeId);
    if (notice) {
      return (
        <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
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
        <span>Showing 1-{notices.length} of {notices.length} notices</span>
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
    </div>
  );
}
