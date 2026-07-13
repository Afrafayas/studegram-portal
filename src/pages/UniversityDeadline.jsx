import React, { useState } from 'react';

export default function UniversityDeadline() {
  const [selectCountry, setSelectCountry] = useState('India');
  const [univCountry, setUnivCountry] = useState('United Kingdom');
  const [univName, setUnivName] = useState('All');
  const [activePill, setActivePill] = useState('All');

  const pills = [
    { label: 'All', count: 46 },
    { label: 'Foundation', count: 3 },
    { label: 'International Year One', count: 3 },
    { label: 'Postgraduate', count: 25 }
  ];

  // Sample data: Anglia Ruskin, University of Surrey, Coventry University, University of Exeter
  // Proximity colors: red within 30 days (before 23 Jul), amber within 60 days (before 22 Aug), green otherwise
  const deadlinesData = [
    { id: 1, university: 'Anglia Ruskin University', courseType: 'Postgraduate', appDeadline: '15 Jul 2026', scholarshipDeadline: '01 Jul 2026', urgency: 'danger' },
    { id: 2, university: 'University of Surrey', courseType: 'Postgraduate', appDeadline: '10 Aug 2026', scholarshipDeadline: '01 Aug 2026', urgency: 'warning' },
    { id: 3, university: 'Coventry University', courseType: 'Foundation', appDeadline: '15 Sep 2026', scholarshipDeadline: '30 Aug 2026', urgency: 'success' },
    { id: 4, university: 'University of Exeter', courseType: 'International Year One', appDeadline: '31 Oct 2026', scholarshipDeadline: '15 Sep 2026', urgency: 'success' }
  ];

  const filteredDeadlines = deadlinesData.filter((item) => {
    if (activePill === 'All') return true;
    return item.courseType === activePill;
  });

  const getDeadlineStyle = (urgency) => {
    switch (urgency) {
      case 'danger':
        return 'text-[#EF4444] font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded';
      case 'warning':
        return 'text-[#F59E0B] font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded';
      case 'success':
      default:
        return 'text-[#10B981] font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded';
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">University Deadlines</h1>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Review critical intake deadlines colored by proximity urgency.</p>
      </div>

      {/* Filter Card: white rounded-2xl, 3 dropdowns */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select Country */}
        <div>
          <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Select Country</label>
          <div className="relative">
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
              value={selectCountry}
              onChange={(e) => setSelectCountry(e.target.value)}
            >
              <option value="India">India</option>
              <option value="Nepal">Nepal</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Bangladesh">Bangladesh</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* University Country */}
        <div>
          <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">University Country</label>
          <div className="relative">
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
              value={univCountry}
              onChange={(e) => setUnivCountry(e.target.value)}
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="United States">United States</option>
              <option value="Australia">Australia</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* University Name */}
        <div>
          <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">University Name</label>
          <div className="relative">
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
              value={univName}
              onChange={(e) => setUnivName(e.target.value)}
            >
              <option value="All">All Universities</option>
              <option value="Anglia Ruskin University">Anglia Ruskin University</option>
              <option value="Coventry University">Coventry University</option>
              <option value="University of Surrey">University of Surrey</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Course Type Pill Filters */}
      <div className="flex flex-wrap items-center gap-2 select-none">
        {pills.map((pill) => {
          const isActive = activePill === pill.label;
          return (
            <button
              key={pill.label}
              onClick={() => setActivePill(pill.label)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 shadow-sm hover:scale-[1.02] ${
                isActive
                  ? 'bg-[#D99A1C] text-white'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              {pill.label} <span className={`ml-1.5 ${isActive ? 'text-white/80' : 'text-[#64748B]'}`}>({pill.count})</span>
            </button>
          );
        })}
      </div>

      {/* Table Data Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">University Name</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Course Type</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Application Deadline</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Scholarship Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeadlines.length > 0 ? (
                filteredDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#0F172A]">{deadline.university}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-[#0F172A] px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-slate-200 uppercase">
                        {deadline.courseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={getDeadlineStyle(deadline.urgency)}>
                        {deadline.appDeadline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#64748B] font-semibold">{deadline.scholarshipDeadline}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-xs text-[#64748B] font-semibold">
                    No deadlines matched this course selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
