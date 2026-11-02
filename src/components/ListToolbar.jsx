import SearchableSelect from './SearchableSelect';
export default function ListToolbar({ list, fields = [], label = 'records' }) {
  const active = Boolean(list.search || Object.values(list.filters).some(value => value !== '' && value !== 'All' && value != null));
  return <div className="w-full min-w-0 space-y-2">
    <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
      <input type="search" value={list.search} onChange={event => list.setSearch(event.target.value)} aria-label={'Search all ' + label + ' fields'} placeholder="Search all fields..." className="h-9 min-w-[170px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-amber-500 focus:bg-white" />
      {fields.map(({ key, label: fieldLabel, options }) => <div key={key} className="w-36 min-w-[125px] shrink-0">
        <SearchableSelect value={list.filters[key] || 'All'} onChange={event => list.setFilter(key, event.target.value)} aria-label={fieldLabel} searchLabel={'Search ' + fieldLabel.toLowerCase()} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs">
          <option value="All">All {fieldLabel}</option>
          {[...new Set(options || list.facets[key] || [])].filter(value => value != null && value !== '' && value !== 'All').map(option => {
            const value = typeof option === 'object' ? option.value : String(option);
            const title = typeof option === 'object' ? option.label : String(option);
            return <option key={value} value={value}>{title}</option>;
          })}
        </SearchableSelect>
      </div>)}
      <button type="button" disabled={!active} onClick={list.reset} className="ml-auto h-9 shrink-0 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Reset</button>
    </div>
    {list.error && <div role="alert" className="flex items-center justify-between gap-2 text-xs text-red-700"><span>{list.error}</span><button type="button" onClick={list.refresh} className="font-bold underline">Retry</button></div>}
    {list.loading && <p role="status" className="text-xs text-slate-500">Loading {label}...</p>}
  </div>;
}
export function ListPagination({ list }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-slate-600">
    <span>{list.total === 0 ? '0 results' : ((list.page - 1) * list.limit + 1) + ' - ' + Math.min(list.page * list.limit, list.total) + ' of ' + list.total}</span>
    <div className="flex items-center gap-2">
      <select aria-label="Results per page" value={list.limit} onChange={event => list.setLimit(event.target.value)} className="rounded-lg border border-slate-200 bg-white p-2">{[5, 10, 15, 25, 50].map(size => <option key={size} value={size}>{size} / page</option>)}</select>
      <button type="button" disabled={list.loading || list.page <= 1} onClick={() => list.setPage(list.page - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:opacity-40">Previous</button>
      <span>{list.page} / {list.totalPages}</span>
      <button type="button" disabled={list.loading || list.page >= list.totalPages} onClick={() => list.setPage(list.page + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 disabled:opacity-40">Next</button>
    </div>
  </div>;
}
