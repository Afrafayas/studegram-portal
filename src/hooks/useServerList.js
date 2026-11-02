import { useCallback, useEffect, useState } from 'react';
import API from '../api/axios';
import { createListQuery, normalizeListResponse } from '../utils/serverList.mjs';
export default function useServerList(endpoint, { initialLimit = 15, fixedFilters = {}, params = {}, reloadKey = '' } = {}) {
  const [records, setRecords] = useState([]);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimitState] = useState(initialLimit);
  const [facets, setFacets] = useState({});
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const filterKey = JSON.stringify({ ...filters, ...fixedFilters });
  const paramsKey = JSON.stringify(params);
  const contextKey = JSON.stringify(fixedFilters);
  useEffect(() => { setPage(1); }, [endpoint, contextKey]);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 250); return () => clearTimeout(timer); }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setRecords([]);
    if (search !== debouncedSearch) return () => controller.abort();
    const query = createListQuery({ params: JSON.parse(paramsKey), search: debouncedSearch, filters: JSON.parse(filterKey), page, limit });
    API.get(endpoint, { signal: controller.signal, params: query }).then(response => {
      if (controller.signal.aborted) return;
      const result = normalizeListResponse(response.data);
      setRecords(result.records); setFacets(result.facets); setTotal(result.total); setTotalPages(result.totalPages);
      if (result.page !== page) setPage(result.page);
    }).catch(err => {
      if (!controller.signal.aborted) { setRecords([]); setTotal(0); setTotalPages(1); setError(err.response?.data?.message || err.message || 'Unable to load records.'); }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [endpoint, filterKey, paramsKey, page, limit, search, debouncedSearch, version, reloadKey]);
  const setSearch = useCallback(value => { setSearchState(value); setPage(1); }, []);
  const setFilter = useCallback((key, value) => { setFilters(previous => ({ ...previous, [key]: value })); setPage(1); }, []);
  const setLimit = useCallback(value => { setLimitState(Number(value)); setPage(1); }, []);
  const reset = useCallback(() => { setSearchState(''); setDebouncedSearch(''); setFilters({}); setPage(1); }, []);
  const refresh = useCallback(() => setVersion(previous => previous + 1), []);
  return { records, setRecords, search, setSearch, filters, setFilter, page, setPage, limit, setLimit, facets, total, totalPages, loading, error, reset, refresh };
}
