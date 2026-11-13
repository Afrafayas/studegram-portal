import ListFilterTabs from '../components/ListFilterTabs';
import { listSourceVersion } from '../utils/serverList.mjs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { mapListApplication } from '../utils/listApplication';
import SearchableSelect from '../components/SearchableSelect';
import { ActionButton } from '../components/ActionControls';
import React, { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import ClaimCommissionConfirmModal from '../components/ClaimCommissionConfirmModal';
export const STATUS_STEPS = [
  'Application Received',
  'Application Under Review',
  'Application Not Processed',
  'Application Processed',
  'Additional Documents Required',
  'Conditional Offer Issued',
  'Unconditional Offer Issued',
  'Fees Paid',
  'CAS Requested',
  'CAS Issued',
  'Visa Received',
  'Rejected & Closed',
  'Withdrawn & Closed',
  'Student Enrolled & Closed'
];

export default function ApplicationHistory({
  onAddApplicationClick,
  applications = [],
  commissions = [],
  dashboardFilter = null,
  onClearDashboardFilter,
  duplicateAlert,
  setDuplicateAlert,
  onViewDetails,
  onEditClick,
  onRefreshApplications
}) {
  const toast = useToast();
  const list = useServerList('/applications', { initialLimit: 5, reloadKey: listSourceVersion(applications) });
  const [selectedAppForClaim, setSelectedAppForClaim] = useState(null);

  // Scoping tab state
  const [activeTab, setActiveTab] = useState('All');

  // Filter States
  const statusFilter = list.filters.status || 'All';
  const universityFilter = list.filters.university || 'All';
  const intakeFilter = list.filters.intake || 'All';

  // Pagination State
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(5);

  useEffect(() => {
    setLocalPage(1);
  }, [dashboardFilter]);

  const handleTabChange = (tab) => {
    if (onClearDashboardFilter) onClearDashboardFilter();
    setActiveTab(tab);
    if (tab === 'All') {
      list.setFilter('status', 'All');
    } else {
      list.setFilter('status', tab);
    }
    list.setPage(1);
  };

  // Human-readable label for active dashboard filter
  const getFilterBadgeLabel = () => {
    switch (dashboardFilter) {
      case 'in_progress':
        return 'Under Review / In Progress';
      case 'closed':
        return 'Case Closed';
      case 'claimed':
        return 'Commissions Claimed';
      case 'pending_commission':
        return 'Commission Pending';
      case 'all':
      case 'total':
        return 'Total Applications';
      default:
        return dashboardFilter;
    }
  };

  // Applications matching dashboard filter
  const rawDashboardApps = useMemo(() => {
    if (!dashboardFilter) return null;
    let records = applications || [];
    if (dashboardFilter === 'in_progress') {
      records = records.filter(a => {
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
    } else if (dashboardFilter === 'closed') {
      records = records.filter(a => {
        const s = (a.status || a.secondaryStatus || '').toLowerCase();
        return (
          s.includes('closed') ||
          s.includes('approved') ||
          s.includes('rejected') ||
          s.includes('withdrawn') ||
          s.includes('enrolled')
        );
      });
    } else if (dashboardFilter === 'claimed') {
      records = records.filter(a => {
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
    } else if (dashboardFilter === 'pending_commission') {
      records = records.filter(a => {
        const aId = String(a._id || a.id || '');
        if (a.commissionStatus === 'Claimed' || (['Visa Approved', 'Enrolled / Closed'].includes(a.status) && a.commissionStatus !== 'Paid')) return true;
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
    }
    return records.map(mapListApplication);
  }, [applications, commissions, dashboardFilter]);

  // Search filter applied over dashboard filter if search term exists
  const displayedList = useMemo(() => {
    if (!dashboardFilter) {
      return list.records.map(mapListApplication);
    }
    let records = rawDashboardApps || [];
    if (list.search && list.search.trim()) {
      const q = list.search.toLowerCase().trim();
      records = records.filter(a =>
        (a.studentName && a.studentName.toLowerCase().includes(q)) ||
        (a.passportNo && a.passportNo.toLowerCase().includes(q)) ||
        (a.camsId && a.camsId.toLowerCase().includes(q)) ||
        (a.universityName && a.universityName.toLowerCase().includes(q)) ||
        (a.courseName && a.courseName.toLowerCase().includes(q))
      );
    }
    return records;
  }, [dashboardFilter, rawDashboardApps, list.records, list.search]);

  // Paginated records for table view
  const paginatedApps = useMemo(() => {
    if (!dashboardFilter) {
      return displayedList;
    }
    const start = (localPage - 1) * localLimit;
    return displayedList.slice(start, start + localLimit);
  }, [dashboardFilter, displayedList, localPage, localLimit]);

  // Pagination adapter for ListPagination component
  const paginationList = useMemo(() => {
    if (!dashboardFilter) return list;
    return {
      ...list,
      total: displayedList.length,
      page: localPage,
      limit: localLimit,
      totalPages: Math.max(1, Math.ceil(displayedList.length / localLimit)),
      loading: false,
      setPage: (p) => setLocalPage(p),
      setLimit: (l) => { setLocalLimit(Number(l)); setLocalPage(1); }
    };
  }, [dashboardFilter, list, displayedList.length, localPage, localLimit]);

  // Export filtered applications to UTF-8 CSV
  const handleExportCSV = async () => {
    let exportApps;
    if (dashboardFilter) {
      exportApps = displayedList;
    } else {
      try {
        const response = await API.get('/applications', {
          params: {
            list: true,
            export: true,
            search: list.search,
            filters: JSON.stringify(list.filters)
          }
        });
        if (!response.data?.success) throw new Error('Unable to export applications.');
        exportApps = response.data.data.map(mapListApplication);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        return;
      }
    }
    if (!exportApps.length) {
      if (toast?.info) toast.info('No applications available to export.');
      else if (toast?.error) toast.error('No applications available to export.');
      return;
    }

    const headers = [
      'Application ID',
      'Student Name',
      'Passport Number',
      'Email',
      'Phone',
      'University',
      'Course',
      'Level',
      'Intake',
      'Status',
      'Commission Status',
      'Date Added'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(','),
      ...exportApps.map(a => [
        escapeCSV(a.camsId || a._id || a.id),
        escapeCSV(a.studentName),
        escapeCSV(a.passportNo),
        escapeCSV(a.email),
        escapeCSV(a.phone),
        escapeCSV(a.universityName),
        escapeCSV(a.courseName),
        escapeCSV(a.level),
        escapeCSV(a.intake),
        escapeCSV(a.status || a.secondaryStatus),
        escapeCSV(a.commissionStatus),
        escapeCSV(a.dateAdded)
      ].join(','))
    ];

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (toast?.success) {
      toast.success(`Successfully exported ${exportApps.length} application records.`);
    }
  };

  // Tab counts calculation from prop
  const totalCount = applications.length;
  const submittedCount = applications.filter(a => ['Application Received', 'Submitted'].includes(a.status || a.secondaryStatus)).length;
  const underReviewCount = applications.filter(a => (a.status || a.secondaryStatus || '').toLowerCase().includes('review')).length;
  const offersCount = applications.filter(a => (a.status || a.secondaryStatus || '').toLowerCase().includes('offer')).length;
  const visaCount = applications.filter(a => (a.status || a.secondaryStatus || '').toLowerCase().includes('visa')).length;
  const enrolledCount = applications.filter(a => (a.status || a.secondaryStatus || '').toLowerCase().includes('enrolled')).length;

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Top Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Application History</h1>
          <p className="text-xs text-slate-500 font-medium">Manage, search, track and submit student applications for international universities.</p>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={handleExportCSV}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all cursor-pointer"
          >
            Export CSV
          </ActionButton>
          <ActionButton
            onClick={onAddApplicationClick}
            className="rounded-xl bg-[#D99A1C] hover:bg-[#F5B025] px-4 py-2 text-xs font-black text-white shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Application</span>
          </ActionButton>
        </div>
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
          <ActionButton
            onClick={() => setDuplicateAlert(null)}
            className="text-red-800 hover:text-red-950 font-bold px-2 py-1 rounded hover:bg-red-100 transition-colors"
          >
            Dismiss
          </ActionButton>
        </div>
      )}

      {/* Active Dashboard Filter Banner */}
      {dashboardFilter && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 shrink-0 text-base">📊</span>
            <div>
              <span className="font-extrabold text-amber-900">Dashboard Filter Active: </span>
              <span className="bg-white border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-full font-bold ml-1">
                {getFilterBadgeLabel()} ({displayedList.length} application{displayedList.length === 1 ? '' : 's'})
              </span>
            </div>
          </div>
          <ActionButton
            onClick={() => {
              if (onClearDashboardFilter) onClearDashboardFilter();
            }}
            className="text-amber-800 hover:text-amber-950 font-bold px-3 py-1 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
          >
            <span>✕ Clear Filter</span>
          </ActionButton>
        </div>
      )}

      {/* Table Directory Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/applications" field="status" options={[{ value: 'All', label: 'All' }, ...(list.facets.status || []).map(value => ({ value, label: value }))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="applications"
          fields={[
            { key: 'status', label: 'Statuses', options: STATUS_STEPS },
            { key: 'university', label: 'Universities' },
            { key: 'intake', label: 'Intakes' },
            { key: 'country', label: 'Countries' }
          ]}
        />


        <div className="overflow-x-auto">
          <table className="workspace-table w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student & Passport</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">University & Course</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApps.length > 0 ? (
                paginatedApps.map((app, index) => {
                  const currentStatus = app.status || app.secondaryStatus || 'Application Received';
                  const s = currentStatus.toLowerCase();

                  const isClosed = s.includes('enrolled') || s.includes('visa received') || s.includes('fees paid');
                  const isOffer = s.includes('offer') || s.includes('cas') || s.includes('processed');
                  const isRejected = s.includes('rejected') || s.includes('withdrawn') || s.includes('not processed');
                  const isDocs = s.includes('additional documents');

                  let badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (isClosed) {
                    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold';
                  } else if (isOffer) {
                    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                  } else if (isRejected) {
                    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                  } else if (isDocs) {
                    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                  }


                  const canClaim = ['Visa Received', 'Student Enrolled & Closed', 'Visa Approved', 'Enrolled / Closed'].includes(currentStatus) &&
                    app.commissionStatus !== 'Claimed' &&
                    app.commissionStatus !== 'Paid' &&
                    app.commissionStatus !== 'Approved';

                  return (
                    <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                      key={app.camsId || app._id || app.id || index}
                      onClick={() => onViewDetails && onViewDetails(app)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[#D99A1C] font-black group-hover:text-[#F5B025] transition-colors flex items-center gap-1 text-xs">
                          <span>{app.camsId || 'APP'}</span>
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-slate-900 group-hover:text-[#D99A1C] transition-colors">{app.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">Passport: {app.passportNo || 'Pending'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-slate-900">{app.universityName}</div>
                        <div className="text-[10px] text-slate-500 font-semibold leading-relaxed truncate max-w-xs">
                          {app.courseName}{app.level ? ` • ${app.level}` : ''} ({app.intake || 'Current'})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${badgeStyle}`}>
                            {currentStatus}
                          </span>
                          {app.commissionStatus && (
                            <span className="block text-[9px] font-black text-emerald-600">
                              💰 {app.commissionStatus === 'Paid' ? 'Commission Paid' : `Comm: ${app.commissionStatus}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-medium">{app.dateAdded}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          items={[
                            {
                              label: 'View Application Details',
                              onClick: () => onViewDetails && onViewDetails(app)
                            },
                            {
                              label: 'Edit Application',
                              onClick: () => onEditClick && onEditClick(app)
                            },
                            ...(canClaim ? [
                              {
                                label: '💸 Claim Commission',
                                onClick: () => setSelectedAppForClaim(app)
                              }
                            ] : [])
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-xs text-slate-400 font-semibold">
                    No applications matched your search or filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ListPagination list={paginationList} />
      </div>

      {/* Claim Commission Confirmation Modal */}
      <ClaimCommissionConfirmModal
        isOpen={!!selectedAppForClaim}
        application={selectedAppForClaim}
        onClose={() => setSelectedAppForClaim(null)}
        onConfirmed={() => {
          list.refresh();
          if (onRefreshApplications) onRefreshApplications();
        }}
      />
    </div>
  );
}
