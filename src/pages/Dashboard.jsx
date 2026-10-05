import React from 'react';

export default function Dashboard({ 
  applications = [], 
  commissions = [],
  partnerName = 'Partner', 
  onViewDetails, 
  onViewHistory,
  onNavigateDeadlines,
  onNewApplicationClick
}) {
    // Calculate Commission statistics
  const claimedCommissions = commissions.length > 0 
    ? commissions.filter(c => c.status === 'Claimed' || c.status === 'Pending Approval' || c.status === 'Paid')
    : applications.filter(a => a.commissionClaimed || a.commissionStatus === 'Claimed' || a.commissionStatus === 'Paid');

  const commissionClaimedCount = claimedCommissions.length;

  const earnedCommissionAmount = commissions.length > 0
    ? commissions.filter(c => c.status === 'Paid').reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
    : applications.filter(a => a.commissionStatus === 'Paid').reduce((sum, a) => sum + (Number(a.commissionAmount) || 0), 0);

  const pendingCommissions = commissions.length > 0
    ? commissions.filter(c => c.status === 'Claimed' || c.status === 'Pending Approval' || c.status === 'Under Review')
    : applications.filter(a => a.commissionStatus === 'Claimed' || (['Visa Approved', 'Enrolled / Closed'].includes(a.status) && a.commissionStatus !== 'Paid'));

  const commissionPendingCount = pendingCommissions.length;

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Under Review / In Progress',
      value: applications.filter(a => {
        const s = (a.status || a.secondaryStatus || '').toLowerCase();
        return (
          s.includes('submitted') || 
          s.includes('review') || 
          s.includes('processing') || 
          s.includes('pending') || 
          s.includes('draft') || 
          s.includes('cas') || 
          s.includes('paid')
        );
      }).length.toString(),
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50',
      icon: (
        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Commissions Claimed',
      value: commissionClaimedCount.toString(),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      extra: (
        <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <span>Earned: ₹{earnedCommissionAmount.toLocaleString()}</span>
        </div>
      ),
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Commission Pending',
      value: commissionPendingCount.toString(),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      extra: (
        <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <span>Awaiting Payout</span>
        </div>
      ),
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Case Closed',
      value: applications.filter(a => {
        const s = (a.status || a.secondaryStatus || '').toLowerCase();
        return (
          s.includes('closed') || 
          s.includes('approved') || 
          s.includes('rejected') || 
          s.includes('withdrawn') || 
          s.includes('enrolled')
        );
      }).length.toString(),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const getBadgeStyle = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('closed') || s.includes('approved') || s.includes('enrolled')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('offer') || s.includes('cas')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (s.includes('rejected') || s.includes('withdrawn')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getInitials = (name = '') => {
    if (!name || name === 'N/A') return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const recentApps = applications.slice(0, 5).map(app => {
    const currentStatus = app.status || app.secondaryStatus || 'Submitted';
    return {
      name: app.studentName || 'N/A',
      initials: getInitials(app.studentName),
      passport: app.passportNo || 'N/A',
      status: currentStatus,
      badgeColor: getBadgeStyle(currentStatus),
      date: app.dateAdded || 'N/A',
      rawApp: app
    };
  });

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Upcoming deadlines with colored dates by urgency (red within 30 days, amber within 60, green otherwise)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{greeting}, {partnerName} 👋</h1>
            <p className="text-xs text-[#64748B] font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* New Application CTA Button */}
        {onNewApplicationClick && (
          <button
            onClick={onNewApplicationClick}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ New Application</span>
          </button>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${stat.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[28px] font-black tracking-tight text-[#0F172A] block leading-tight">{stat.value}</span>
                <span className="text-xs text-[#64748B] font-bold block truncate">{stat.label}</span>
              </div>
            </div>
            {stat.extra && (
              <div className="mt-2.5 pt-2 border-t border-slate-100">
                {stat.extra}
              </div>
            )}
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
              <div className="flex items-center gap-3">
                {onNewApplicationClick && (
                  <button 
                    onClick={onNewApplicationClick}
                    className="text-xs text-[#D99A1C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ New Application</span>
                  </button>
                )}
                <button 
                  onClick={() => onViewHistory && onViewHistory()}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold hover:underline"
                >
                  View History
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApps.length > 0 ? (
                    recentApps.map((student, index) => (
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${student.badgeColor}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-xs text-[#64748B] font-semibold whitespace-nowrap">{student.date}</td>
                        <td className="px-6 py-3.5 text-right whitespace-nowrap pr-6">
                          <button 
                            onClick={() => onViewDetails && onViewDetails(student.rawApp)} 
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-all duration-150 inline-flex items-center justify-center"
                          >
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
                      <td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-400 font-semibold select-none">
                        No applications filed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (40%): Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Upcoming Deadlines</h2>
            <button 
              onClick={() => onNavigateDeadlines && onNavigateDeadlines()}
              className="text-xs text-[#D99A1C] font-semibold hover:underline"
            >
              View All
            </button>
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
