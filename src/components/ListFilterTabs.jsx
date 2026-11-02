import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function ListFilterTabs({ list, endpoint, field, options, fixedFilters = {}, params = {}, label = 'Filter records' }) {
  const [counts, setCounts] = useState({});
  const [failed, setFailed] = useState(false);
  const filters = { ...list.filters, ...fixedFilters };
  delete filters[field];
  const key = JSON.stringify({ endpoint, field, options, filters, params, search: list.search, total: list.total, records: list.records });
  useEffect(() => {
    const controller = new AbortController();
    setCounts({}); setFailed(false);
    const timer = setTimeout(() => {
      Promise.all(options.map(async option => {
        const queryFilters = { ...filters };
        if (option.value !== 'All') queryFilters[field] = option.value;
        const response = await API.get(endpoint, { signal: controller.signal, params: { ...params, list: true, page: 1, limit: 1, search: list.search.trim(), filters: JSON.stringify(queryFilters) } });
        if (!response.data?.success) throw new Error('Unable to load counts');
        return [option.value, response.data.totalCount ?? response.data.total ?? response.data.count ?? 0];
      })).then(entries => { if (!controller.signal.aborted) setCounts(Object.fromEntries(entries)); }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    }, list.search ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [key]);
  const selected = list.filters[field] || 'All';
  return <div className="space-y-1"><div role="group" aria-label={label} className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3">{options.map(option => <button key={option.value} type="button" aria-pressed={selected === option.value} onClick={() => list.setFilter(field, option.value)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 ${selected === option.value ? 'bg-[#F4B626] text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{option.label} <span className="ml-1 tabular-nums">({counts[option.value] ?? '…'})</span></button>)}</div>{failed && <p role="status" className="text-xs text-slate-500">Counts are temporarily unavailable.</p>}</div>;
}
