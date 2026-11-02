import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createListQuery, normalizeListResponse, listSourceVersion } from '../src/utils/serverList.mjs';
test('list requests send full backend search with filters and pagination in one query', () => {
  const query = createListQuery({ search: ' Student 42 ', page: 3, limit: 10, filters: { status: 'All', country: 'India', empty: '', isPreset: false }, fixedFilters: { country: 'Canada', direction: 'received' }, params: { view: 'registry' } });
  assert.equal(query.list, 'true'); assert.equal(query.search, 'Student 42'); assert.equal(query.page, 3); assert.equal(query.limit, 10); assert.equal(query.view, 'registry');
  assert.deepEqual(JSON.parse(query.filters), { country: 'Canada', isPreset: false, direction: 'received' });
});
test('server totals and clamped page metadata are respected instead of slicing current records', () => {
  const rows = [{ _id: 'record-beyond-first-page' }];
  const response = normalizeListResponse({ success: true, data: rows, totalCount: 42, totalPages: 5, currentPage: 5, facets: { country: ['India', 'Canada'] } });
  assert.equal(response.records, rows); assert.equal(response.total, 42); assert.equal(response.page, 5); assert.equal(response.totalPages, 5);
});
test('failed collection responses are surfaced and missing optional metadata is safe', () => {
  assert.throws(() => normalizeListResponse({ success: false, message: 'Access denied' }), /Access denied/);
  assert.throws(() => normalizeListResponse({ success: true, data: {} }), /Unable to load/);
  assert.deepEqual(normalizeListResponse({ success: true, data: [] }), { records: [], facets: {}, total: 0, totalPages: 1, page: 1 });
});
test('external application and commission updates invalidate list data', () => {
  const initial = [{ _id: '1', status: 'Submitted', commissionStatus: 'Unclaimed' }];
  assert.equal(listSourceVersion(initial), listSourceVersion([...initial]));
  assert.notEqual(listSourceVersion(initial), listSourceVersion([{ ...initial[0], commissionStatus: 'Claimed' }]));
});
