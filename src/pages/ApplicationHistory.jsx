import SearchableSelect from '../components/SearchableSelect';
import { ActionButton } from '../components/ActionControls';
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import ClaimCommissionConfirmModal from '../components/ClaimCommissionConfirmModal';

export default function ApplicationHistory({ onAddApplicationClick, applications = [], duplicateAlert, setDuplicateAlert, onViewDetails, onEditClick, onRefreshApplications }) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForClaim, setSelectedAppForClaim] = useState(null);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [universityFilter, setUniversityFilter] = useState('All');
  const [intakeFilter, setIntakeFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Auto-reset pagination to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, universityFilter, intakeFilter]);

  // Unique filter option lists derived from actual applications
  const standardStatuses = [
    'Submitted',
    'Under Review',
    'Conditional Offer',
    'Unconditional Offer',
    'CAS Issued',
    'Visa Approved',
    'Enrolled / Closed',
    'Rejected'
  ];
  const dynamicStatuses = Array.from(
    new Set(applications.map(a => a.status || a.secondaryStatus).filter(Boolean))
  );
  const availableStatuses = Array.from(new Set([...standardStatuses, ...dynamicStatuses]));

  const availableUniversities = Array.from(
    new Set(applications.map(a => a.universityName || (typeof a.university === 'object' ? a.university?.name : '')).filter(Boolean))
  ).sort();

  const availableIntakes = Array.from(
    new Set(applications.map(a => a.intake).filter(Boolean))
  ).sort();

  const hasActiveFilters = statusFilter !== 'All' || universityFilter !== 'All' || intakeFilter !== 'All' || searchQuery !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setUniversityFilter('All');
    setIntakeFilter('All');
    setCurrentPage(1);
  };

  // Export filtered applications to UTF-8 CSV
  const handleExportCSV = () => {
    if (!filteredApps.length) {
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
      ...filteredApps.map(app => [
        escapeCSV(app.camsId || ''),
        escapeCSV(app.studentName || ''),
        escapeCSV(app.passportNo || ''),
        escapeCSV(app.email || ''),
        escapeCSV(app.phone || ''),
        escapeCSV(app.universityName || (typeof app.university === 'object' ? app.university?.name : '') || ''),
        escapeCSV(app.courseName || ''),
        escapeCSV(app.level || ''),
        escapeCSV(app.intake || ''),
        escapeCSV(app.status || app.secondaryStatus || 'Submitted'),
        escapeCSV(app.commissionStatus || 'Not Claimed'),
        escapeCSV(app.dateAdded || '')
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
      toast.success(`Successfully exported ${filteredApps.length} application records.`);
    }
  };

  const filteredApps = applications.filter((app) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const studentMatch = (app.studentName || '').toLowerCase().includes(q);
      const camsMatch = (app.camsId || '').toLowerCase().includes(q);
      const passMatch = (app.passportNo || '').toLowerCase().includes(q);
      const uniName = app.universityName || (typeof app.university === 'object' ? app.university?.name : '') || '';
      const uniMatch = uniName.toLowerCase().includes(q);
      const courseMatch = (app.courseName || '').toLowerCase().includes(q);
      if (!studentMatch && !camsMatch && !passMatch && !uniMatch && !courseMatch) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'All') {
      const currentStatus = app.status || app.secondaryStatus || 'Submitted';
      if (currentStatus !== statusFilter) {
        return false;
      }
    }

    // University filter
    if (universityFilter !== 'All') {
      const uniName = app.universityName || (typeof app.university === 'object' ? app.university?.name : '') || '';
      if (uniName !== universityFilter) {
        return false;
      }
    }

    // Intake filter
    if (intakeFilter !== 'All') {
      if (app.intake !== intakeFilter) {
        return false;
      }
    }

    return true;
  });

  // Pagination Math
  const totalItems = filteredApps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Top Header */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 border-b border-[#E2E8F0] pb-4">
        <h1 className="text-22px font-bold tracking-tight text-[#0F172A]">Application History</h1>
        <span className="text-xs text-[#64748B] font-semibold">{applications.length} total · {applications.filter(a => a.secondaryStatus === 'Processed').length} processed</span>
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
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] transition-all"
            placeholder="Search students, Application ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter icon button */}
          <ActionButton 
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2.5 border rounded-xl transition-all duration-150 hover:scale-[1.02] shadow-sm cursor-pointer relative ${
              isFilterOpen || hasActiveFilters
                ? 'bg-amber-50 border-[#D99A1C] text-[#D99A1C]'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
            title="Toggle Filter Options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D99A1C] rounded-full border-2 border-white"></span>
            )}
          </ActionButton>

          {/* Export CSV button */}
          <ActionButton 
            type="button"
            onClick={handleExportCSV}
            className="border border-[#D99A1C] text-[#D99A1C] hover:bg-amber-50 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Export filtered records to CSV"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </ActionButton>

          {/* New Application Button */}
          <ActionButton
            onClick={onAddApplicationClick}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Application
          </ActionButton>
        </div>
      </div>

      {/* Collapsible Filter Bar */}
      {isFilterOpen && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Filter Applications</span>
              {hasActiveFilters && (
                <span className="text-[10px] bg-amber-50 text-[#D99A1C] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                  Filters Active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <ActionButton
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#D99A1C] hover:text-[#C28410] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </ActionButton>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                Status
              </label>
              <SearchableSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {availableStatuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </SearchableSelect>
            </div>

            {/* University Filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                University
              </label>
              <SearchableSelect searchLabel="Search universities..."
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] cursor-pointer"
              >
                <option value="All">All Universities</option>
                {availableUniversities.map(univ => (
                  <option key={univ} value={univ}>{univ}</option>
                ))}
              </SearchableSelect>
            </div>

            {/* Intake Filter */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">
                Intake
              </label>
              <SearchableSelect
                value={intakeFilter}
                onChange={(e) => setIntakeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:border-[#D99A1C] cursor-pointer"
              >
                <option value="All">All Intakes</option>
                {availableIntakes.map(intake => (
                  <option key={intake} value={intake}>{intake}</option>
                ))}
              </SearchableSelect>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Student & Passport</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">University & Course</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-[#64748B] text-[10px] font-extrabold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length > 0 ? (
                paginatedApps.map((app, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" onClick={(e) => { e.preventDefault(); onViewDetails && onViewDetails(app); }} className="text-[#D99A1C] font-bold hover:underline text-xs">{app.camsId}</a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-[#0F172A]">{app.studentName}</div>
                      <div className="text-[10px] text-[#64748B] font-semibold">Passport: {app.passportNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-[#0F172A]">{app.universityName}</div>
                      <div className="text-[10px] text-[#64748B] font-semibold leading-relaxed truncate max-w-xs">{app.courseName}{app.level ? ` • ${app.level}` : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const currentStatus = app.status || app.secondaryStatus || 'Submitted';
                          const isClosed = currentStatus.includes('Closed') || currentStatus === 'Enrolled / Closed';
                          const isApproved = currentStatus.includes('Approved');
                          const isOffer = currentStatus.includes('Offer');
                          const isCAS = currentStatus.includes('CAS');
                          const isRejected = currentStatus.includes('Rejected');

                          let badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                          if (isClosed || isApproved) {
                            badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold';
                          } else if (isOffer || isCAS) {
                            badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                          } else if (isRejected) {
                            badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                          }

                          return (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeStyle}`}>
                              {currentStatus}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#64748B] font-semibold">{app.dateAdded}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <ActionButton onClick={() => onViewDetails && onViewDetails(app)} className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-all duration-150 inline-flex items-center justify-center" title="View Details">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </ActionButton>
                        <ActionButton 
                          onClick={() => onEditClick && onEditClick(app)} 
                          title="Edit Application"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] hover:text-[#D99A1C] transition-all duration-150 inline-flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </ActionButton>

                        {/* Claim Commission Action Button & Badges */}
                        {['Visa Approved', 'Enrolled / Closed'].includes(app.status || app.secondaryStatus) && (
                          app.commissionStatus === 'Claimed' ? (
                            <span className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                              Claimed (Pending)
                            </span>
                          ) : app.commissionStatus === 'Paid' || app.commissionStatus === 'Approved' ? (
                            <span className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300">
                              Commission Paid ✓
                            </span>
                          ) : (
                            <ActionButton
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppForClaim(app);
                              }}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-1 cursor-pointer"
                              title="Claim Agency Commission Payout"
                            >
                              💸 Claim Commission
                            </ActionButton>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-xs text-[#64748B] font-semibold space-y-2">
                    <div>No applications matched your search or filter parameters.</div>
                    {hasActiveFilters && (
                      <ActionButton
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs text-[#D99A1C] hover:text-[#C28410] font-bold hover:underline cursor-pointer"
                      >
                        Reset All Filters
                      </ActionButton>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination at bottom */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] font-semibold select-none">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Rows per page:</span>
              <SearchableSelect
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#D99A1C] cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </SearchableSelect>
              {/* <span className="text-xs font-semibold text-slate-400">
                Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} entries
              </span> */}
            </div>

            <div className="flex items-center gap-1.5">
              <ActionButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                ◀ Prev
              </ActionButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <ActionButton
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#D99A1C] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </ActionButton>
              ))}

              <ActionButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next ▶
              </ActionButton>
            </div>
          </div>
        )}
      </div>

      {/* Claim Commission Confirmation Modal */}
      <ClaimCommissionConfirmModal
        isOpen={!!selectedAppForClaim}
        application={selectedAppForClaim}
        onClose={() => setSelectedAppForClaim(null)}
        onConfirmed={() => {
          if (onRefreshApplications) onRefreshApplications();
        }}
      />
    </div>
  );
}
