import { getDisplayId } from '../utils/displayId';
﻿import { useEffect, useState } from 'react';
import API from '../api/axios';
import { ActionButton } from './ActionControls';

function formatDate(value) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function belongsToStaff(person, staff) {
  if (!person || !staff) return false;
  const personId = typeof person === 'object' ? person.id || person._id : person;
  const staffId = staff._id || staff.id;
  if (personId && staffId) return String(personId) === String(staffId);
  // Legacy records may store an email without an ID. Never match on name alone.
  return Boolean(person.email && staff.email && person.email.trim().toLowerCase() === staff.email.trim().toLowerCase());
}

function Detail({ label, children }) {
  return <div className="min-w-0"><dt className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">{label}</dt><dd className="mt-1.5 text-xs font-bold text-slate-900 break-words">{children || 'Not provided'}</dd></div>;
}

export default function StaffDetailPage({ staff, isLoading, loadError, onReload, onBack, onEdit, onToggleStatus, partnerData, roles }) {
  const [applicationState, setApplicationState] = useState({ loading: true, data: [], error: '' });
  const [reload, setReload] = useState(0);
  const staffId = staff?._id || staff?.id;
  useEffect(() => {
    if (!staffId) return;
    const controller = new AbortController();
    async function loadApplications() {
      setApplicationState({ loading: true, data: [], error: '' });
      try {
        const response = await API.get('/applications', { signal: controller.signal });
        if (!response.data?.success || !Array.isArray(response.data.data)) throw new Error(response.data?.message || 'Unable to load application records.');
        if (!controller.signal.aborted) setApplicationState({ loading: false, data: response.data.data, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setApplicationState({ loading: false, data: [], error: error.response?.data?.message || error.message || 'Unable to load application records.' });
      }
    }
    loadApplications();
    return () => controller.abort();
  }, [staffId, reload]);

  const applications = applicationState.data.filter(app => belongsToStaff(app.submittedByStaff, staff) || belongsToStaff(app.pickedBy, staff));
  const submittedCount = applications.filter(app => belongsToStaff(app.submittedByStaff, staff)).length;
  const assignedCount = applications.filter(app => belongsToStaff(app.pickedBy, staff)).length;
  const role = roles.find(item => item.id === staff?.role);
  const agencyName = partnerData?.companyName || partnerData?.name;
  const backButton = <ActionButton type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-[#D99A1C] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7 7-7-7 7-7" /></svg>Back to Staff Directory</ActionButton>;
  if (isLoading && !staff) return <section className="space-y-5">{backButton}<div role="status" className="bg-white border border-slate-200 rounded-2xl p-8 text-sm text-slate-600">Loading staff details…</div></section>;
  if (!staff) return <section className="space-y-5">{backButton}<div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-3"><h1 className="text-lg font-black text-slate-900">{loadError ? 'Unable to load staff details' : 'Staff member unavailable'}</h1><p className="text-xs text-slate-500">{loadError || 'This account may have been removed or is outside your agency access.'}</p>{loadError && <ActionButton onClick={onReload} className="text-xs font-bold text-amber-700">Try again</ActionButton>}</div></section>;
  return (
    <section className="space-y-5" aria-label="Staff details">
      {backButton}
      <header className="bg-white border border-slate-200 border-t-4 border-t-[#D99A1C] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4 min-w-0"><div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center text-lg font-black shrink-0">{staff.name?.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase() || 'ST'}</div><div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D99A1C]">Staff Profile</p><h1 className="text-xl sm:text-2xl font-black text-slate-900 break-words">{staff.name || 'Staff member'}</h1><p className="mt-1 text-xs text-slate-500 break-all">{staff.email}</p></div></div>
        <div className="flex flex-wrap items-center gap-2"><span className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold border ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{staff.status || 'Not recorded'}</span><ActionButton type="button" onClick={() => onEdit(staff)} className="px-4 py-2 rounded-xl bg-[#D99A1C] text-white text-xs font-extrabold hover:bg-amber-600">Edit Profile</ActionButton><ActionButton type="button" onClick={() => onToggleStatus(staff)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50">{staff.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}</ActionButton></div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm"><h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-4 border-b border-slate-100">Profile & Contact Information</h2><dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-5"><Detail label="Full name">{staff.name}</Detail><Detail label="Email address">{staff.email}</Detail><Detail label="Phone number">{staff.phone}</Detail><Detail label="Agency">{agencyName}</Detail><Detail label="Assigned role">{role?.title || staff.role}</Detail><Detail label="Account status">{staff.status}</Detail><Detail label="Joined date">{formatDate(staff.createdAt)}</Detail><Detail label="Last updated">{formatDate(staff.updatedAt)}</Detail><Detail label="Staff ID">{getDisplayId(staff)}</Detail><Detail label="Agency ID">{getDisplayId(staff.partner, getDisplayId(partnerData?.partnerDisplayId, partnerData?.displayId?.startsWith('AGT-') ? partnerData.displayId : '—'))}</Detail></dl></section>
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"><h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-4 border-b border-slate-100">Portal Access</h2><div><p className="text-xs font-extrabold text-slate-900">{role?.title || staff.role}</p><p className="text-xs text-slate-500 mt-2 leading-relaxed">{role?.desc || 'Access is managed by the staff member’s assigned agency role.'}</p></div>{role?.permissions?.length > 0 && <ul className="space-y-2">{role.permissions.map(permission => <li key={permission} className="text-[11px] text-slate-600 break-words">{permission}</li>)}</ul>}<p className="text-[11px] text-slate-500 border-t border-slate-100 pt-4 leading-relaxed">{staff.status === 'Active' ? 'Account is active. Portal access also depends on your agency approval status.' : 'Account is inactive. This staff member cannot sign in.'}</p></section>
      </div>
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xs font-black uppercase tracking-wider text-slate-900">Related Applications</h2><p className="mt-1.5 text-[11px] text-slate-500">Applications submitted or handled by this staff member within your agency.</p></div>{!applicationState.loading && !applicationState.error && <div className="flex gap-2 text-[10px] font-extrabold"><span className="px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded-lg">{submittedCount} Submitted</span><span className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">{assignedCount} Assigned</span></div>}</div>
        {applicationState.loading ? <p role="status" className="p-6 text-xs text-slate-500">Loading application records…</p> : applicationState.error ? <div role="alert" className="p-6 space-y-3"><p className="text-xs text-rose-700">{applicationState.error}</p><ActionButton onClick={() => setReload(value => value + 1)} className="text-xs font-bold text-amber-700">Retry applications</ActionButton></div> : applications.length === 0 ? <p className="p-6 text-xs text-slate-500">No application records are linked to this staff member.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-xs min-w-[760px]"><thead className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-500"><tr>{['Application','Student','University / Course','Intake','Relationship','Status','Submitted'].map(label => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{applications.map(app => <tr key={app._id || app.id} className="align-top"><td className="px-5 py-4 font-bold text-indigo-700">{getDisplayId(app)}</td><td className="px-5 py-4"><p className="font-bold text-slate-900">{app.student?.name || app.studentName || 'Not provided'}</p><p className="mt-1 text-[10px] text-slate-500 break-all">{app.student?.email}</p></td><td className="px-5 py-4"><p className="font-semibold text-slate-800">{app.university?.name || app.universityName || 'Not provided'}</p><p className="mt-1 text-[10px] text-slate-500">{app.course?.title || app.courseName || 'Not provided'}</p></td><td className="px-5 py-4 text-slate-600">{app.intake || 'Not provided'}</td><td className="px-5 py-4 text-slate-600">{[belongsToStaff(app.submittedByStaff, staff) && 'Submitted', belongsToStaff(app.pickedBy, staff) && 'Assigned'].filter(Boolean).join(' / ')}</td><td className="px-5 py-4 font-bold text-slate-800">{app.status || 'Not recorded'}</td><td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(app.createdAt)}</td></tr>)}</tbody></table></div>}
      </section>
    </section>
  );
}
