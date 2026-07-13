import React from 'react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Applications',
      value: '803',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Applications Processed',
      value: '36',
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50',
      icon: (
        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'With CAS Team',
      value: '14',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50',
      icon: (
        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Case Closed',
      value: '393',
      color: 'text-[#64748B]',
      bgColor: 'bg-slate-100',
      icon: (
        <svg className="w-5 h-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      label: 'Offer Issued',
      value: '28',
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50',
      icon: (
        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3-3h6m-3-10a3 3 0 110-6 3 3 0 010 6zm0 0a7 7 0 100 14 7 7 0 000-14z" />
        </svg>
      )
    }
  ];

  const recentApps = [
    { name: 'Shanto Shaju', initials: 'SS', passport: 'T1029482', status: 'Offer Issued', badgeColor: 'bg-blue-50 text-blue-700 border-blue-100', date: '23 Jun 2026' },
    { name: 'Aneesha Anil', initials: 'AA', passport: 'T9381048', status: 'Pending', badgeColor: 'bg-amber-50 text-amber-700 border-amber-100', date: '22 Jun 2026' },
    { name: 'Rahul Krishnan', initials: 'RK', passport: 'T1083921', status: 'Processed', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: '21 Jun 2026' }
  ];

  // Upcoming deadlines with colored dates by urgency (red within 30 days, amber within 60, green otherwise)
  // Current date is 23 Jun 2026
  const upcomingDeadlines = [
    { university: 'Anglia Ruskin University', courseType: 'Postgraduate', date: '15 Jul 2026', urgency: 'danger', reason: 'Within 30 days' },
    { university: 'University of Surrey', courseType: 'Postgraduate', date: '10 Aug 2026', urgency: 'warning', reason: 'Within 60 days' },
    { university: 'Coventry University', courseType: 'Foundation', date: '15 Sep 2026', urgency: 'success', reason: 'Over 60 days' },
    { university: 'University of Exeter', courseType: 'Undergraduate', date: '31 Oct 2026', urgency: 'success', reason: 'Over 60 days' }
  ];

  const getUrgencyClasses = (urgency) => {
    switch (urgency) {
      case 'danger':
        return 'text-[#EF4444] bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold';
      case 'warning':
        return 'text-[#F59E0B] bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-bold';
      case 'success':
      default:
        return 'text-[#10B981] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold';
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* Cute Elephant SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          {/* Back Legs */}
          <rect x="22" y="52" width="8" height="16" rx="4" fill="#B87C0E" />
          <rect x="42" y="52" width="8" height="16" rx="4" fill="#B87C0E" />
          {/* Body */}
          <circle cx="35" cy="42" r="20" fill="#D99A1C" />
          {/* Head */}
          <circle cx="52" cy="38" r="14" fill="#D99A1C" />
          {/* Front Legs */}
          <rect x="28" y="52" width="8" height="16" rx="4" fill="#D99A1C" />
          <rect x="48" y="52" width="8" height="16" rx="4" fill="#D99A1C" />
          {/* Ear */}
          <circle cx="46" cy="34" r="6" fill="#FFFDF5" />
          <circle cx="46" cy="34" r="4" fill="#E2A925" />
          {/* Eye */}
          <circle cx="56" cy="34" r="1.5" fill="#0F172A" />
          {/* Trunk curling right */}
          <path d="M 64 42 C 72 42 76 46 76 50 C 76 54 72 54 70 51" stroke="#D99A1C" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Tail */}
          <path d="M 16 42 Q 10 40 12 46" stroke="#D99A1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Good morning, Partner 👋</h1>
          <p className="text-xs text-[#64748B] font-medium">Tuesday, 23 June 2026</p>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5">
                <span className="text-[32px] font-bold tracking-tight text-[#0F172A] block leading-tight">{stat.value}</span>
                <span className="text-xs text-[#64748B] font-semibold block">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (60%): Recent Applications */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Recent Applications</h2>
              <button className="text-xs text-[#D99A1C] font-semibold hover:underline">View History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApps.map((student, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {student.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">{student.name}</p>
                          <p className="text-[10px] text-[#64748B] font-medium">Passport: {student.passport}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${student.badgeColor}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[#64748B] font-semibold text-right whitespace-nowrap">{student.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (40%): Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Upcoming Deadlines</h2>
            <button className="text-xs text-[#D99A1C] font-semibold hover:underline">View All</button>
          </div>
          <div className="p-4 flex-1 space-y-3.5">
            {upcomingDeadlines.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#0F172A]">{item.university}</p>
                  <p className="text-[10px] text-[#64748B] font-semibold">{item.courseType}</p>
                </div>
                <div className="text-right">
                  <span className={getUrgencyClasses(item.urgency)}>
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
