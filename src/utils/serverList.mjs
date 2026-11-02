export function createListQuery({ search = '', filters = {}, fixedFilters = {}, params = {}, page = 1, limit = 15 } = {}) {
  const selected = Object.fromEntries(Object.entries({ ...filters, ...fixedFilters }).filter(([, value]) => value !== '' && value !== 'All' && value != null));
  return { ...params, list: 'true', search: String(search).trim(), filters: JSON.stringify(selected), page, limit };
}
export function normalizeListResponse(body) {
  if (!body?.success || !Array.isArray(body.data)) throw new Error(body?.message || 'Unable to load records.');
  return { records: body.data, facets: body.facets || {}, total: body.totalCount ?? body.total ?? body.data.length, totalPages: Math.max(1, body.totalPages || 1), page: Math.max(1, body.currentPage || body.page || 1) };
}
export function listSourceVersion(rows = []) {
  return JSON.stringify(rows.map(row => [row._id || row.id, row.updatedAt, row.status, row.commissionClaimed, row.commissionStatus, row.amount, row.rate, row.isCommissionSet]));
}
