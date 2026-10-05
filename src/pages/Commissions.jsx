import React, { useState, useMemo } from 'react';
import ClaimCommissionConfirmModal from '../components/ClaimCommissionConfirmModal';

export default function Commissions({
  applications = [],
  commissions = [],
  onRefresh,
  onViewDetails
}) {
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppForClaim, setSelectedAppForClaim] = useState(null);

  // Combine application data strictly matching each individual application ID
  const combinedStudentCommissions = useMemo(() => {
    return applications.map((app) => {
      const appId = String(app.id || app._id || '');
      const commRecord = commissions.find(c => {
        if (!c.application) return false;
        const cAppId = typeof c.application === 'object' && c.application !== null && c.application._id
          ? String(c.application._id)
          : String(c.application);
        return Boolean(cAppId && appId && cAppId === appId);
      });

      const fee = Number(commRecord?.fee || commRecord?.tuitionFee || app.totalAmount || app.course?.tuitionFee || 15000);

      const statusLower = (app.status || app.secondaryStatus || '').toLowerCase();
      const isVisaApprovedOrEnrolled = statusLower.includes('visa approved') || statusLower.includes('enrolled');

      const isPaid = app.commissionStatus === 'Paid' || commRecord?.status === 'Paid';

      const isClaimed = Boolean(
        app.commissionClaimed ||
        app.commissionStatus === 'Claimed' ||
        commRecord?.status === 'Claimed' ||
        commRecord?.status === 'Pending Approval' ||
        isPaid
      );

      // Commission is set strictly if admin explicitly set this specific application's commission or marked as Paid
      const isSet = Boolean(
        (commRecord && commRecord.isCommissionSet) ||
        (!commRecord && app.isCommissionSet) ||
        isPaid
      );

      const rate = isSet
        ? (commRecord?.rate !== undefined ? Number(commRecord.rate) : (app.commissionRate || 10))
        : 10;

      const commType = commRecord?.commissionType || app.commissionType || 'percentage';

      let amount = 0;
      if (isSet) {
        amount = Number(commRecord?.amount || app.commissionAmount || 0);
        if (!amount || amount <= 0) {
          amount = commType === 'fixed' && commRecord?.fixedAmount
            ? Number(commRecord.fixedAmount)
            : Math.round((fee * (rate || 10)) / 100);
        }
      }

      const universityPaid = Boolean(
        commRecord?.universityPaid ||
        commRecord?.universityPaymentStatus === 'University Paid' ||
        app.universityPaid ||
        app.universityPaymentStatus === 'University Paid'
      );

      return {
        ...app,
        commRecord,
        fee,
        rate,
        commType,
        payableAmount: amount,
        isSet,
        isVisaApprovedOrEnrolled,
        isClaimed,
        isPaid,
        universityPaid,
        universityPaymentStatus: universityPaid ? 'University Paid' : 'Waiting for University to Pay',
        payoutDate: commRecord?.payoutDate || app.payoutDate || '',
        commissionStatusDisplay: isPaid ? 'Paid' : isClaimed ? 'Claimed' : isVisaApprovedOrEnrolled ? 'Eligible' : 'Not Eligible'
      };
    });
  }, [applications, commissions]);

  // Enrolled / Visa Approved students
  const enrolledStudents = useMemo(() => {
    return combinedStudentCommissions.filter(item => item.isVisaApprovedOrEnrolled);
  }, [combinedStudentCommissions]);

  // 1. Total Enrolled Students
  const totalEnrolledCount = enrolledStudents.length;
  const totalEnrolledTuitionVolume = enrolledStudents.reduce((sum, item) => sum + item.fee, 0);

  // 2. Total Commission (only count amounts set by admin for each application)
  const setEnrolledCommissions = enrolledStudents.filter(item => item.isSet);
  const totalCommissionAmount = setEnrolledCommissions.reduce((sum, item) => sum + item.payableAmount, 0);
  const totalCommissionCases = enrolledStudents.length;

  // 3. Commissions Claimed
  const claimedStudents = useMemo(() => {
    return combinedStudentCommissions.filter(item => item.isClaimed || item.isPaid);
  }, [combinedStudentCommissions]);

  const claimedCount = claimedStudents.length;
  const claimedSetAmount = claimedStudents.filter(item => item.isSet).reduce((sum, item) => sum + item.payableAmount, 0);
  const paidAmount = combinedStudentCommissions.filter(item => item.isPaid).reduce((sum, item) => sum + item.payableAmount, 0);

  // 4. Pending Commissions
  const pendingStudents = useMemo(() => {
    return combinedStudentCommissions.filter(item => item.isClaimed && !item.isPaid);
  }, [combinedStudentCommissions]);

  const pendingCount = pendingStudents.length;
  const pendingSetAmount = pendingStudents.filter(item => item.isSet).reduce((sum, item) => sum + item.payableAmount, 0);

  // Filtering for table
  const filteredStudents = useMemo(() => {
    return combinedStudentCommissions.filter(item => {
      if (filterTab === 'Eligible to Claim' && (item.commissionStatusDisplay !== 'Eligible' || item.isClaimed || item.isPaid)) {
        return false;
      }
      if (filterTab === 'Claimed' && (!item.isClaimed || item.isPaid)) {
        return false;
      }
      if (filterTab === 'Paid' && !item.isPaid) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (item.studentName || '').toLowerCase().includes(q);
        const passportMatch = (item.passportNo || '').toLowerCase().includes(q);
        const camsMatch = (item.camsId || '').toLowerCase().includes(q);
        const uniMatch = (item.universityName || '').toLowerCase().includes(q);
        const courseMatch = (item.courseName || '').toLowerCase().includes(q);
        return nameMatch || passportMatch || camsMatch || uniMatch || courseMatch;
      }

      return true;
    });
  }, [combinedStudentCommissions, filterTab, searchQuery]);

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#F0F2F5] min-h-[calc(100vh-60px)]">
      {/* Top Banner / Header */}
      <div className="bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Commissions & Payouts</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Agency Earnings
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Monitor enrolled students, claim agency commissions once visas are approved, and track payouts after Admin configures and approves disbursements.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="self-start md:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Status</span>
          </button>
        )}
      </div>

      {/* 4 Stat Cards with Amount AND Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enrolled Students */}
        <div className="bg-white border border-[#E2E8F0] border-t-4 border-t-blue-500 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Enrolled Students</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              🎓
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {totalEnrolledCount}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md w-fit border border-blue-100">
              <span>Tuition: ₹{totalEnrolledTuitionVolume.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Commission */}
        <div className="bg-white border border-[#E2E8F0] border-t-4 border-t-purple-500 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Commission</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              💎
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {setEnrolledCommissions.length > 0 ? `₹${totalCommissionAmount.toLocaleString()}` : '—'}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md w-fit border border-purple-100">
              {setEnrolledCommissions.length > 0
                ? <span>{setEnrolledCommissions.length} of {totalCommissionCases} Set</span>
                : <span>{totalCommissionCases} Awaiting Admin Setting</span>}
            </div>
          </div>
        </div>

        {/* Card 3: Commissions Claimed */}
        <div className="bg-white border border-[#E2E8F0] border-t-4 border-t-emerald-500 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commissions Claimed</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              💰
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {claimedSetAmount > 0 ? `₹${claimedSetAmount.toLocaleString()}` : (claimedCount > 0 ? '—' : '₹0')}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit border border-emerald-100">
              <span>{claimedCount} Claimed</span>
              <span>•</span>
              <span>₹{paidAmount.toLocaleString()} Disbursed</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Commissions */}
        <div className="bg-white border border-[#E2E8F0] border-t-4 border-t-amber-500 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Commissions</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              ⏳
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {pendingSetAmount > 0 ? `₹${pendingSetAmount.toLocaleString()}` : (pendingCount > 0 ? '—' : '₹0')}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md w-fit border border-amber-100">
              <span>{pendingCount} Awaiting Admin Payout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student List with All Details */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Enrolled Students & Commission Pipeline
            </h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
              {filteredStudents.length} files
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, passport, university..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D99A1C] focus:bg-white transition-all font-medium"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[10px] font-bold w-full sm:w-auto">
              {['All', 'Eligible to Claim', 'Claimed', 'Paid'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 rounded-lg transition-all flex-1 sm:flex-none text-center ${
                    filterTab === tab
                      ? 'bg-white text-[#D99A1C] shadow-sm font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {filteredStudents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Student Details</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University & Course</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Tuition Fee</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Rate / Type</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Payable Comm</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University Status</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Commission Status</th>
                  <th className="px-5 py-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredStudents.map((app) => {
                  const initials = app.studentName
                    ? app.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'ST';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Student Profile */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{app.studentName}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                              <span>Pass: {app.passportNo || 'N/A'}</span>
                              <span>•</span>
                              <span className="text-[#D99A1C] font-mono font-bold">{app.camsId || 'CAMS'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* University & Course */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-bold text-slate-800 truncate max-w-xs">{app.courseName}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{app.universityName} ({app.intake || 'Sep 2026'})</p>
                        </div>
                      </td>

                      {/* Course Tuition */}
                      <td className="px-5 py-3.5 text-slate-700 font-bold">
                        ₹{app.fee.toLocaleString()}
                      </td>

                      {/* Rate / Type (Strictly per-application) */}
                      <td className="px-5 py-3.5 text-slate-500">
                        {app.isSet ? (
                          app.commType === 'fixed' ? (
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                              Fixed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                              {app.rate}%
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 font-bold text-xs select-none">—</span>
                        )}
                      </td>

                      {/* Payable Commission (Strictly per-application) */}
                      <td className="px-5 py-3.5 text-slate-950 font-black text-sm">
                        {app.isSet ? (
                          `₹${app.payableAmount.toLocaleString()}`
                        ) : (
                          <span className="text-slate-400 font-semibold text-xs italic select-none">
                            —
                          </span>
                        )}
                      </td>

                      {/* University Status */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1 ${
                          app.universityPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                        >
                          <span>{app.universityPaid ? '✓ Uni Paid' : '⏳ Waiting for Uni'}</span>
                        </span>
                      </td>

                      {/* Commission Status */}
                      <td className="px-5 py-3.5">
                        {app.isPaid ? (
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
                              Paid ✓
                            </span>
                            {app.payoutDate && (
                              <p className="text-[8px] text-slate-400 font-medium mt-0.5">{app.payoutDate}</p>
                            )}
                          </div>
                        ) : app.isClaimed ? (
                          app.isSet ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-300 inline-block">
                              Commission Set
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 inline-block animate-pulse">
                              Claimed (Pending)
                            </span>
                          )
                        ) : app.isVisaApprovedOrEnrolled ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-300 inline-block">
                            Ready to Claim
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 inline-block">
                            {app.status || 'In Progress'}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Claim Commission Button */}
                          {app.isVisaApprovedOrEnrolled && !app.isClaimed && !app.isPaid ? (
                            <button
                              type="button"
                              onClick={() => setSelectedAppForClaim(app)}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-[10px] uppercase px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center gap-1 cursor-pointer"
                              title="Claim Agency Commission Payout"
                            >
                              <span>💰</span>
                              <span>Claim Commission</span>
                            </button>
                          ) : null}

                          {/* View Application Details */}
                          {onViewDetails && (
                            <button
                              type="button"
                              onClick={() => onViewDetails(app)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
                              title="View Application Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 font-bold text-xs">
              No commission records found matching the current filter.
            </div>
          )}
        </div>
      </div>

      {/* Claim Commission Modal */}
      {selectedAppForClaim && (
        <ClaimCommissionConfirmModal
          isOpen={Boolean(selectedAppForClaim)}
          onClose={() => setSelectedAppForClaim(null)}
          application={selectedAppForClaim}
          onConfirmed={() => {
            if (onRefresh) onRefresh();
            setSelectedAppForClaim(null);
          }}
        />
      )}
    </div>
  );
}
