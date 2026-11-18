import { listSourceVersion } from '../utils/serverList.mjs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { mapListApplication } from '../utils/listApplication';
import { ActionButton } from '../components/ActionControls';
import React, { useMemo } from 'react';
import unigatherMascot from '../assets/unigather-mascot.png';
import UnigatherLoader from '../components/UnigatherLoader';

export default function Dashboard({
  applications = [],
  commissions = [],
  partnerName = 'Partner',
  onViewDetails,
  onViewHistory,
  onNavigateDeadlines,
  onNewApplicationClick
}) {
  const list = useServerList('/applications', { initialLimit: 5, reloadKey: listSourceVersion(applications) });
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

  // Filtered lists for each card
  const totalApps = applications;

  const inProgressApps = useMemo(() => {
    return applications.filter(a => {
      const s = (a.status || a.secondaryStatus || '').toLowerCase();
      return (
        s.includes('received') ||
        s.includes('submitted') ||
        s.includes('review') ||
        s.includes('processing') ||
        s.includes('processed') ||
        s.includes('documents') ||
        s.includes('pending') ||
        s.includes('draft') ||
        s.includes('cas') ||
        s.includes('offer') ||
        s.includes('fees')
      );
    });
  }, [applications]);

  const claimedApps = useMemo(() => {
    return applications.filter(a => {
      const aId = String(a._id || a.id || '');
      if (a.commissionClaimed || a.commissionStatus === 'Claimed' || a.commissionStatus === 'Paid') return true;
      if (commissions && commissions.length > 0) {
        return commissions.some(c => {
          const cAppId = typeof c.application === 'object' && c.application !== null
            ? String(c.application._id || c.application.id || '')
            : String(c.application || '');
          return cAppId && cAppId === aId && (c.status === 'Claimed' || c.status === 'Pending Approval' || c.status === 'Paid');
        });
      }
      return false;
    });
  }, [applications, commissions]);

  const pendingCommissionApps = useMemo(() => {
    return applications.filter(a => {
      const aId = String(a._id || a.id || '');
      if (a.commissionStatus === 'Claimed' || (['Visa Received', 'Student Enrolled & Closed', 'Visa Approved', 'Enrolled / Closed'].includes(a.status) && a.commissionStatus !== 'Paid')) return true;
      if (commissions && commissions.length > 0) {
        return commissions.some(c => {
          const cAppId = typeof c.application === 'object' && c.application !== null
            ? String(c.application._id || c.application.id || '')
            : String(c.application || '');
          return cAppId && cAppId === aId && (c.status === 'Claimed' || c.status === 'Pending Approval' || c.status === 'Under Review');
        });
      }
      return false;
    });
  }, [applications, commissions]);

  const closedApps = useMemo(() => {
    return applications.filter(a => {
      const s = (a.status || a.secondaryStatus || '').toLowerCase();
      return (
        s.includes('closed') ||
        s.includes('approved') ||
        s.includes('rejected') ||
        s.includes('withdrawn') ||
        s.includes('enrolled')
      );
    });
  }, [applications]);

  // Card click redirection: always navigate to ApplicationHistory with the selected filter
  const handleCardClick = (filteredList, filterType) => {
    if (onViewHistory) {
      onViewHistory(filterType);
    }
  };

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => handleCardClick(totalApps, 'all'),
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Under Review / In Progress',
      value: inProgressApps.length.toString(),
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50',
      onClick: () => handleCardClick(inProgressApps, 'in_progress'),
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
      onClick: () => handleCardClick(claimedApps, 'claimed'),
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
      onClick: () => handleCardClick(pendingCommissionApps, 'pending_commission'),
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
      value: closedApps.length.toString(),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => handleCardClick(closedApps, 'closed'),
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

  const recentApps = list.records.map(mapListApplication).map(app => {
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

  // Helper to parse deadline dates from intake or application data
  const parseUpcomingDeadlines = (apps = []) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeApps = apps.filter(a => {
      const st = (a.status || a.secondaryStatus || '').toLowerCase();
      return !st.includes('closed') && !st.includes('rejected') && !st.includes('withdrawn') && !st.includes('enrolled');
    });

    const deadlineMap = new Map();

    activeApps.forEach(app => {
      const univ = app.universityName || (typeof app.university === 'object' ? app.university?.name : '') || '';
      const courseType = app.level || 'Academic Program';


      if (!univ) return;

      // Try to estimate deadline date from intake (e.g. "September 2026", "January 2027", "15 Jul 2026")
      let targetDate = null;

      // Check if app has explicit deadline property
      if (app.deadline || app.appDeadline) {
        const d = new Date(app.deadline || app.appDeadline);
        if (!isNaN(d.getTime())) targetDate = d;
      }

      // Only include upcoming dates (future or within the current year)
      if (targetDate) {
        const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          let urgency = 'success';
          let reason = 'Over 60 days';
          if (diffDays <= 30) {
            urgency = 'danger';
            reason = 'Within 30 days';
          } else if (diffDays <= 60) {
            urgency = 'warning';
            reason = 'Within 60 days';
          }

          const dateStr = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          const uniqueKey = `${univ}-${courseType}-${dateStr}`;

          if (!deadlineMap.has(uniqueKey)) {
            deadlineMap.set(uniqueKey, {
              university: univ,
              courseType,
              date: dateStr,
              rawDate: targetDate,
              urgency,
              reason,
              diffDays
            });
          }
        }
      }
    });

    // Sort by earliest deadline first and take top 4
    return Array.from(deadlineMap.values())
      .sort((a, b) => a.rawDate - b.rawDate)
      .slice(0, 4);
  };

  const upcomingDeadlines = useMemo(() => {
    return parseUpcomingDeadlines(applications);
  }, [applications]);

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
    <div className="workspace-page flex-1 p-8 space-y-8 bg-[#F8FAFC] animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Unigather Mascot */}
          <img
            src={unigatherMascot}
            alt="Unigather Mascot"
            className="h-24 sm:h-32 lg:h-36 w-auto object-contain shrink-0 drop-shadow-md select-none pointer-events-none"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">{greeting}, {partnerName} 👋</h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* New Application CTA Button */}
        {onNewApplicationClick && (
          <ActionButton
            onClick={onNewApplicationClick}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-[#07163B] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-95 shadow-md shadow-amber-500/15 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#07163B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Application</span>
          </ActionButton>
        )}
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') stat.onClick?.(); }}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between group cursor-pointer select-none"
          >
            {/* <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${stat.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[28px] font-black tracking-tight text-[#0F172A] block leading-tight">{stat.value}</span>
                <span className="text-xs text-[#64748B] font-bold block truncate group-hover:text-amber-600 transition-colors">{stat.label}</span>
              </div>
            </div> */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-[28px] font-black tracking-tight text-[#0F172A] leading-tight">
                  {stat.value}
                </span>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
              </div>
              <span className="text-xs text-[#64748B] font-bold block leading-tight mt-2.5 group-hover:text-amber-600 transition-colors">
                {stat.label}
              </span>
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
        <div className="workspace-list-frame lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Recent Applications</h2>
              <div className="flex items-center gap-3">
                {onNewApplicationClick && (
                  <ActionButton
                    onClick={onNewApplicationClick}
                    className="text-xs text-[#D99A1C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span> New Application</span>
                  </ActionButton>
                )}
                <ActionButton
                  onClick={() => onViewHistory && onViewHistory()}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold hover:underline"
                >
                  View History
                </ActionButton>
              </div>
            </div>
            <ListToolbar list={list} label="applications" fields={[{ "key": "status", "label": "Statuses" }, { "key": "university", "label": "Universities" }]} />
            <div className="overflow-x-auto">
              <table className="workspace-table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <UnigatherLoader variant="inline" text="Loading recent applications..." />
                      </td>
                    </tr>
                  ) : recentApps.length > 0 ? (
                    recentApps.map((student, index) => (
                      <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }} key={index} onClick={() => onViewDetails && onViewDetails(student.rawApp)} className="hover:bg-amber-50/40 transition-colors duration-150 cursor-pointer group">
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
                        <td className="px-6 py-3.5 text-right whitespace-nowrap pr-6" onClick={(e) => e.stopPropagation()}>
                          <ActionMenu
                            items={[
                              {
                                label: 'View Application Details',
                                onClick: () => onViewDetails && onViewDetails(student.rawApp)
                              }
                            ]}
                          />
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
            <ListPagination list={list} />
          </div>
        </div>

        {/* Upcoming Deadlines temporarily hidden from the agent dashboard.

        <div className="workspace-list-frame lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Upcoming Deadlines</h2>
              {upcomingDeadlines.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </div>
            <ActionButton 
              onClick={() => onNavigateDeadlines && onNavigateDeadlines()}
              className="text-xs text-[#D99A1C] font-semibold hover:underline cursor-pointer"
            >
              View All
            </ActionButton>
          </div>

          <div className="p-4 flex-1 space-y-3.5">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#0F172A] truncate max-w-[180px]">{item.university}</p>
                    <p className="text-[10px] text-[#64748B] font-semibold">{item.courseType}</p>
                  </div>
                  <div className="text-right">
                    <span className={getUrgencyClasses(item.urgency)}>
                      {item.date}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 px-4 text-center space-y-2 my-auto">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-sm">
                  📅
                </div>
                <p className="text-xs font-bold text-slate-600">No Upcoming Intake Deadlines</p>
                <p className="text-[10px] text-slate-400 font-medium">All deadlines for your submitted applications are currently up to date.</p>
              </div>
            )}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
