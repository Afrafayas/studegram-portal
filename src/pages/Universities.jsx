import ListRecordView from '../components/ListRecordView';
import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { formatFee } from '../utils/courseFee';
import { ActionButton } from '../components/ActionControls';
import React, { useState } from 'react';

export default function Universities({ setActivePage }) {
  const [listRecord, setListRecord] = React.useState(null);

  const list = useServerList('/universities');
  const [activeTab, setActiveTab] = useState('All');

  const universities = list.records.map(u => ({
    ...u,
    id: u._id || u.id,
    popularCourses: u.courses ? u.courses.map(c => typeof c === 'object' ? c.title : c) : [],
    badge: u.ranking ? `Ranked ${u.ranking}` : '',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    rating: u.rating || 'Not provided',
    fee: u.courses && u.courses.length > 0 ? (typeof u.courses[0] === 'object' ? formatFee(u.courses[0].tuitionFee, u.courses[0].currency, u.courses[0].feePeriod) : 'Varies') : 'Varies'
  }));

  const handleTabChange = (countryName) => {
    setActiveTab(countryName);
    if (countryName === 'All') {
      list.setFilter('country', undefined);
    } else {
      list.setFilter('country', countryName);
    }
    list.setPage(1);
  };

  const countriesList = Array.from(new Set(universities.map(u => u.country).filter(Boolean)));

  return (
    listRecord ? <div className="workspace-page flex-1 p-4 sm:p-6"><ListRecordView record={listRecord} title={listRecord.displayName || listRecord.title || listRecord.name || listRecord.university || 'Record details'} onBack={() => setListRecord(null)} /></div> : (<div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Page Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Partner Universities</h1>
          <p className="text-xs text-slate-500 font-medium">Browse global universities, rankings, tuition fees, and program intakes.</p>
        </div>
      </div>

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/universities" field="country" options={[{value:'All',label:'All'},...(list.facets.country || []).map(value=>({value,label:value}))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="universities"
          fields={[
            { key: 'country', label: 'Countries' },
            { key: 'city', label: 'Cities' }
          ]}
        />

        

        <div className="overflow-x-auto">
          {list.loading ? (
            <div className="flex justify-center p-12">
              <svg className="animate-spin h-8 w-8 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : universities.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Ranking / Rating</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Available Courses</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Intake & Fees</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {universities.map((uni) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={uni.id}
                    onClick={() => setListRecord(uni)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-[#D99A1C] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                          🏛️
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{uni.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{uni.code || 'University Partner'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 block">{uni.city ? `${uni.city}, ` : ''}{uni.country}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {uni.ranking && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold border bg-amber-50 text-amber-800 border-amber-200">
                            🏆 {uni.ranking}
                          </span>
                        )}
                        {uni.rating && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-blue-50 text-blue-700 border-blue-200">
                            ★ {uni.rating}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="font-bold text-indigo-600 block text-xs">
                          {uni.popularCourses.length > 0 ? `${uni.popularCourses.length} Programs` : 'Multiple Courses'}
                        </span>
                        {uni.popularCourses.length > 0 && (
                          <p className="text-[10px] text-slate-400 truncate">{uni.popularCourses.slice(0, 2).join(', ')}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-bold block">{uni.intake || 'Multiple Seasons'}</span>
                        <span className="text-[10px] font-black text-emerald-700 block">{uni.fee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'Browse University Courses',
                            onClick: () => setActivePage && setActivePage('SearchCourses')
                          },
                          {
                            label: 'View University Deadlines',
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
              No universities found matching your search.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>
    </div>)
  );
}
