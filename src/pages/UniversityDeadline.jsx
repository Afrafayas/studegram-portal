import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { ActionButton } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState } from 'react';

export default function UniversityDeadline() {
  const list = useServerList('/courses', { params: { view: 'deadlines' } });
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  const formatDate = (value) => {
    if (!value || Number.isNaN(new Date(value).getTime())) return value || 'Open Intake';
    return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDeadlineBadge = (deadlineStr) => {
    if (!deadlineStr || Number.isNaN(new Date(deadlineStr).getTime())) {
      return <span className="text-slate-400 font-semibold text-[10px]">Open Intake</span>;
    }
    const today = new Date();
    const deadlineDate = new Date(deadlineStr);
    const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const formatted = formatDate(deadlineStr);

    if (diffDays < 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-rose-50 text-rose-700 border-rose-200">
          Closed ({formatted})
        </span>
      );
    } else if (diffDays <= 30) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
          Closing Soon ({formatted})
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200">
          Open ({formatted})
        </span>
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      list.setFilter('courseType', undefined);
    } else {
      list.setFilter('courseType', tab);
    }
    list.setPage(1);
  };

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Page Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">University Deadlines</h1>
          <p className="text-xs text-slate-500 font-medium">Stay ahead of crucial admission cutoff dates, intake deadlines, and scholarship closing windows.</p>
        </div>
      </div>

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/courses" field="courseType" params={{view:"deadlines"}} options={[{value:'All',label:'All'},...(list.facets.courseType || []).map(value=>({value,label:value}))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="deadlines"
          fields={[
            { key: 'university', label: 'Universities' },
            { key: 'courseType', label: 'Types' },
            { key: 'country', label: 'Countries' }
          ]}
        />

        

        <div className="overflow-x-auto">
          {list.records.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Course / Level</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Application Deadline</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Scholarship Deadline</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {list.records.map((row) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={row.id || row._id}
                    onClick={() => setSelectedDeadline(row)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{row.university}</p>
                      <p className="text-[10px] text-slate-400">{row.country || 'Global'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200">
                        {row.courseType || 'Degree Program'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getDeadlineBadge(row.appDeadline)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(row.scholarshipDeadline)}
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Deadline Details',
                            onClick: () => setSelectedDeadline(row)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              No matching deadlines found.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>

      {/* Deadline Detail Modal */}
      {selectedDeadline && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h2 className="font-black text-slate-900 text-base">{selectedDeadline.university}</h2>
            <p className="text-xs font-bold text-[#D99A1C]">{selectedDeadline.country || 'Global Partner'}</p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Course Type</span>
                <span className="font-bold text-slate-800">{selectedDeadline.courseType || 'Degree Program'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">App Deadline</span>
                <span className="font-bold text-slate-800">{formatDate(selectedDeadline.appDeadline)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Scholarship Deadline</span>
                <span className="font-bold text-slate-800">{formatDate(selectedDeadline.scholarshipDeadline)}</span>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <ActionButton
                onClick={() => setSelectedDeadline(null)}
                className="bg-[#D99A1C] hover:bg-[#F5B025] text-white rounded-xl px-5 py-2 text-xs font-bold"
              >
                Close
              </ActionButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
