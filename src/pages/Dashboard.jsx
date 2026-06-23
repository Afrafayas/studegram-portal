import React from 'react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Applications',
      value: '803',
      color: 'text-[#6366F1]',
      bgColor: 'bg-indigo-50',
      icon: (
        <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5]">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Good morning, Agent 👋</h1>
        <p className="text-xs text-[#64748B] font-medium">Tuesday, 23 June 2026</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <button className="text-xs text-[#6366F1] font-semibold hover:underline">View History</button>
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] text-white flex items-center justify-center font-bold text-xs shrink-0">
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
            <button className="text-xs text-[#6366F1] font-semibold hover:underline">View All</button>
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
