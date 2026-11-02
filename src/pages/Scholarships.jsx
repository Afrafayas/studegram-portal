import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { ActionButton } from '../components/ActionControls';
import React, { useState } from 'react';
import useApiCollection from '../hooks/useApiCollection';
import ScholarshipDetailsModal from '../components/ScholarshipDetailsModal';

export default function Scholarships({ setActivePage }) {
  const list = useServerList('/scholarships');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedScholarshipForDetails, setSelectedScholarshipForDetails] = useState(null);

  const { records, loading, error } = list;
  const { records: universities } = useApiCollection('/universities');
  const scholarshipData = records.map(item => ({
    ...item,
    id: item._id,
    name: item.title,
    university: item.university || '',
    country: item.country || universities.find(u => u.name === item.university)?.country || '',
    type: item.category || 'Not specified',
    eligibility: item.eligibility || '',
    gradient: 'from-blue-600 to-indigo-800'
  }));

  const countryFlags = {
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'United States': '🇺🇸',
    'Australia': '🇦🇺',
    'Ireland': '🇮🇪'
  };

  const handleTabChange = (category) => {
    setActiveTab(category);
    if (category === 'All') {
      list.setFilter('category', undefined);
    } else {
      list.setFilter('category', category);
    }
    list.setPage(1);
  };

  const getDeadlineBadge = (deadlineStr) => {
    if (!deadlineStr || Number.isNaN(new Date(deadlineStr).getTime())) return <span className="text-slate-400 text-[10px]">Open</span>;
    const today = new Date();
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (diffDays < 0) {
      return (
        <span className="text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
          Expired ({formattedDate})
        </span>
      );
    } else if (diffDays <= 60) {
      return (
        <span className="text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
          Closing Soon ({formattedDate})
        </span>
      );
    } else {
      return (
        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">
          Open ({formattedDate})
        </span>
      );
    }
  };

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Scholarships Directory</h1>
          <p className="text-xs text-slate-500 font-medium">Browse merit, need, and research-based scholarships from global university partners.</p>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading scholarships...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/scholarships" field="category" options={[{value:'All',label:'All'},...(list.facets.category || []).map(value=>({value,label:value}))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="scholarships"
          fields={[
            { key: 'country', label: 'Countries' },
            { key: 'university', label: 'Universities' },
            { key: 'category', label: 'Categories' },
            { key: 'status', label: 'Statuses' }
          ]}
        />

        

        <div className="overflow-x-auto">
          {scholarshipData.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Scholarship Title</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Offered By</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Value / Award</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {scholarshipData.map((s) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={s.id}
                    onClick={() => setSelectedScholarshipForDetails(s)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{countryFlags[s.country] || '🌍'}</span>
                        <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{s.university}</p>
                      <p className="text-[10px] text-slate-400">{s.country || 'Global'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200">
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-700 text-xs">
                      {s.amount || 'Grant Award'}
                    </td>
                    <td className="px-6 py-4">
                      {getDeadlineBadge(s.deadline)}
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'Check Criteria & Details',
                            onClick: () => setSelectedScholarshipForDetails(s)
                          },
                          {
                            label: 'View Deadlines',
                            onClick: () => setActivePage && setActivePage('UniversityDeadline')
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
              No scholarships found matching your criteria.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>

      {/* Scholarship Details Modal */}
      <ScholarshipDetailsModal
        isOpen={!!selectedScholarshipForDetails}
        onClose={() => setSelectedScholarshipForDetails(null)}
        scholarship={selectedScholarshipForDetails}
      />
    </div>
  );
}
