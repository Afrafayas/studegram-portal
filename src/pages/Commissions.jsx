import ListFilterTabs from '../components/ListFilterTabs';
import { listSourceVersion } from '../utils/serverList.mjs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import SearchableSelect from '../components/SearchableSelect';
import { parseFee, formatFee, feeCurrency } from '../utils/courseFee';
import { ActionButton } from '../components/ActionControls';
import React, { useState, useEffect, useMemo } from 'react';
import ClaimCommissionConfirmModal from '../components/ClaimCommissionConfirmModal';

export default function Commissions({
  applications = [],
  commissions = [],
  partnerData,
  onRefresh,
  onViewDetails
}) {
  const isOwner = !partnerData?.isStaff || partnerData?.role === 'AgencyAdmin';
  const userPermissions = Array.isArray(partnerData?.permissions) ? partnerData.permissions : [];
  const canClaim = isOwner || partnerData?.role === 'Manager' || userPermissions.includes('commissions:claim') || userPermissions.includes('commissions:manage');

  const list = useServerList('/commissions', { initialLimit: 10, params: { view: 'registry' }, reloadKey: listSourceVersion([...applications, ...commissions]) });
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

      const fee = (parseFee(app.tuitionFee ?? app.course?.tuitionFee ?? commRecord?.fee ?? commRecord?.tuitionFee) ?? 0);

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
        ? (commRecord?.rate !== undefined ? Number(commRecord.rate) : (app.commissionRate ?? 0))
        : 0;

      const commType = commRecord?.commissionType || app.commissionType || 'percentage';

      let amount = 0;
      if (isSet) {
        amount = Number(commRecord?.amount || app.commissionAmount || 0);
        if (!amount || amount <= 0) {
          amount = commType === 'fixed' && commRecord?.fixedAmount
            ? Number(commRecord.fixedAmount)
            : Math.round((fee * (rate ?? 0)) / 100);
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
        currency: feeCurrency(app.tuitionFee ?? app.course?.tuitionFee, app.currency || app.course?.currency || commRecord?.currency),
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

  const filteredStudents = list.records;
  const paginatedStudents = filteredStudents;
  const totalItems = list.total;
  const startIndex = (list.page - 1) * list.limit;

  return (
    <div className="workspace-page flex-1 p-6 space-y-6 bg-[#F0F2F5] min-h-[calc(100vh-60px)]">
      {/* Top Banner / Header */}
      <div className="workspace-panel bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <ActionButton
            onClick={() => { list.refresh(); onRefresh?.(); }}
            className="self-start md:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Status</span>
          </ActionButton>
        )}
      </div>

      {/* Student List with All Details */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/commissions" params={{view:'registry'}} field="commissionStatusDisplay" options={[{value:'All',label:'All commissions'},{value:'Eligible',label:'Eligible'},{value:'Claimed',label:'Claimed'},{value:'Paid',label:'Paid'},{value:'Not Eligible',label:'Not eligible'}]} />
        <ListToolbar list={list} label="commissions" fields={[{key:'commissionStatusDisplay',label:'Commission Statuses'},{key:'universityPaymentStatus',label:'University Payments'},{key:'university',label:'Universities'},{key:'country',label:'Countries'}]} />


        {/* Table View */}
        <div className="overflow-x-auto">
          {filteredStudents.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
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
                {paginatedStudents.map((app, index) => {
                  const initials = app.studentName
                    ? app.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'ST';

                  return (
                    <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }} key={app.id || app._id || index} onClick={() => onViewDetails && onViewDetails(app)} className="hover:bg-amber-50/40 transition-colors cursor-pointer group">
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
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{app.universityName} ({app.intake || 'Not provided'})</p>
                        </div>
                      </td>

                      {/* Course Tuition */}
                      <td className="px-5 py-3.5 text-slate-700 font-bold">
                        {formatFee(app.tuitionFee ?? app.course?.tuitionFee ?? app.fee, app.currency, app.feePeriod ?? app.course?.feePeriod ?? app.commRecord?.feePeriod)}
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
                      <td className="px-5 py-3.5 text-right pr-6 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          items={[
                            ...(onViewDetails ? [{
                              label: 'View Application Details',
                              onClick: () => onViewDetails(app)
                            }] : []),
                            ...(app.isVisaApprovedOrEnrolled && !app.isClaimed && !app.isPaid && canClaim ? [{
                              label: '💰 Claim Commission',
                              onClick: () => setSelectedAppForClaim(app)
                            }] : [])
                          ]}
                        />
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

        <ListPagination list={list} />
      </div>

      {/* Claim Commission Modal */}
      {selectedAppForClaim && (
        <ClaimCommissionConfirmModal
          isOpen={Boolean(selectedAppForClaim)}
          onClose={() => setSelectedAppForClaim(null)}
          application={selectedAppForClaim}
          onConfirmed={() => {
            list.refresh();
            if (onRefresh) onRefresh();
            setSelectedAppForClaim(null);
          }}
        />
      )}
    </div>
  );
}
