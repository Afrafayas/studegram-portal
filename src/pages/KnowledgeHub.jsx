import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import { ActionButton } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { getDisplayId } from '../utils/displayId';

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState('universities');
  const [selectedItem, setSelectedItem] = useState(null);

  const list = useServerList('/universities');
  const guides = useServerList('/notices', { fixedFilters: { view: 'guides' } });

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Page Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Knowledge Hub</h1>
          <p className="text-xs text-slate-500 font-medium">Access partner university profiles, entry requirements, and official operational guides.</p>
        </div>
      </div>

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto p-4 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('universities')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'universities' ? 'bg-[#0A0A0F] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            University Knowledge ({list.total || list.records.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guides' ? 'bg-[#D99A1C] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Official Guides ({guides.total || guides.records.length})
          </button>
        </div>

        {activeTab === 'universities' ? (
          <>
            <ListToolbar
              list={list}
              label="university information"
              fields={[
                { key: 'country', label: 'Countries' },
                { key: 'city', label: 'Cities' }
              ]}
            />

            

            <div className="overflow-x-auto">
              {list.records.length > 0 ? (
                <table className="workspace-table w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Ranking</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Requirements</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {list.records.map((uni) => (
                      <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                        key={uni._id || uni.id}
                        onClick={() => setSelectedItem({ type: 'uni', data: uni })}
                        className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{uni.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{getDisplayId(uni)}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {[uni.city, uni.country].filter(Boolean).join(', ') || 'Global'}
                        </td>
                        <td className="px-6 py-4">
                          {uni.ranking ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-amber-50 text-amber-800 border-amber-200">
                              🏆 {uni.ranking}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate text-[11px]">
                          {uni.requirements?.length ? uni.requirements.join(' • ') : (uni.description || 'General admissions criteria')}
                        </td>
                        <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <ActionMenu
                            items={[
                              {
                                label: 'View University Profile',
                                onClick: () => setSelectedItem({ type: 'uni', data: uni })
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
                  No matching university information found.
                </div>
              )}
            </div>

            <ListPagination list={list} />
          </>
        ) : (
          <>
            <ListToolbar
              list={guides}
              label="guides"
              fields={[
                { key: 'category', label: 'Categories' },
                { key: 'priority', label: 'Priorities' }
              ]}
            />

            

            <div className="overflow-x-auto">
              {guides.records.length > 0 ? (
                <table className="workspace-table w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Guide Title</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Summary</th>
                      <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {guides.records.map((guide) => (
                      <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                        key={guide._id || guide.id}
                        onClick={() => setSelectedItem({ type: 'guide', data: guide })}
                        className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{guide.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{getDisplayId(guide)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200">
                            {guide.category || 'General Guide'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            guide.priority === 'Urgent' || guide.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {guide.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-md truncate text-[11px]">
                          {guide.content || 'Official procedure guide.'}
                        </td>
                        <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <ActionMenu
                            items={[
                              {
                                label: 'Read Full Guide',
                                onClick: () => setSelectedItem({ type: 'guide', data: guide })
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
                  No matching guides found.
                </div>
              )}
            </div>

            <ListPagination list={guides} />
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            {selectedItem.type === 'uni' ? (
              <>
                <h2 className="font-black text-slate-900 text-base">{selectedItem.data.name}</h2>
                <p className="text-xs font-bold text-[#D99A1C]">
                  {[selectedItem.data.city, selectedItem.data.country].filter(Boolean).join(', ')}
                </p>
                {selectedItem.data.ranking && (
                  <p className="text-xs font-bold text-slate-700">Ranking: {selectedItem.data.ranking}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedItem.data.description || 'No detailed description available.'}
                </p>
                {!!selectedItem.data.requirements?.length && (
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Admissions Criteria:</span>
                    <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                      {selectedItem.data.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="font-black text-slate-900 text-base">{selectedItem.data.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200 inline-block">
                  {selectedItem.data.category || 'General Guide'}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-2">
                  {selectedItem.data.content}
                </p>
              </>
            )}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <ActionButton
                onClick={() => setSelectedItem(null)}
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
