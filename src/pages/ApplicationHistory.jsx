import React, { useState } from 'react';

export default function ApplicationHistory({ onAddApplicationClick, applications = [], duplicateAlert, setDuplicateAlert }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter((app) => {
    return (
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.camsId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.passportNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
      {/* Top Header */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
        <h1 className="text-22px font-bold tracking-tight text-[#0F172A]">Application History</h1>
        <span className="text-xs text-[#64748B] font-semibold">803 total · 36 processed</span>
      </div>

      {/* Duplicate Alert Banner */}
      {duplicateAlert && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex gap-2">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="font-semibold">
              Duplicate Alert: This passport number ({duplicateAlert}) has already been submitted by another agent. Please verify before proceeding.
            </p>
          </div>
          <button 
            onClick={() => setDuplicateAlert(null)} 
            className="text-red-800 hover:text-red-950 font-bold px-2 py-1 rounded hover:bg-red-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
            placeholder="Search students, CAMS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter icon button */}
          <button className="p-2.5 bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-xl transition-all duration-150 hover:scale-[1.02] shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          {/* Export CSV button */}
          <button className="border border-[#6366F1] text-[#6366F1] hover:bg-indigo-50 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] shadow-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>

          {/* New Application Button */}
          <button
            onClick={onAddApplicationClick}
            className="bg-[#6366F1] hover:bg-[#5053e3] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Application
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">CAMS ID</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student & Passport</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">University & Course</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length > 0 ? (
                filteredApps.map((app, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-[#6366F1] font-bold hover:underline text-xs">{app.camsId}</a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-[#0F172A]">{app.studentName}</div>
                      <div className="text-[10px] text-[#64748B] font-semibold">Passport: {app.passportNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-[#0F172A]">{app.universityName}</div>
                      <div className="text-[10px] text-[#64748B] font-semibold leading-relaxed truncate max-w-xs">{app.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-1.5 items-start">
                        {/* Processed Badge (Green/Success: #10B981) */}
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100 uppercase">
                          {app.primaryStatus}
                        </span>
                        {/* Secondary Badges: blue=offer issued, amber=pending */}
                        {app.secondaryStatus === 'Offer Issued' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-blue-50 text-blue-700 border-blue-100 uppercase">
                            Offer Issued
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border bg-amber-50 text-amber-700 border-amber-100 uppercase">
                            Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#64748B] font-semibold">{app.dateAdded}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-all duration-150 inline-flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-xs text-[#64748B] font-semibold">
                    No applications matched your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination at bottom */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] font-semibold select-none">
          <span>Showing 1-{filteredApps.length} of {filteredApps.length} results</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 border border-[#E2E8F0] bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1.5 border border-[#E2E8F0] bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
