import { useState } from 'react';
import useApiCollection from '../hooks/useApiCollection';
import { publishedDeadlines } from '../utils/resourceData';

export default function UniversityDeadline() {
  const courses = useApiCollection('/courses');
  const scholarships = useApiCollection('/scholarships');
  const [university, setUniversity] = useState('All');
  const [type, setType] = useState('All');
  const rows = publishedDeadlines(courses.records, scholarships.records);
  const universities = [...new Set(rows.map(row => row.university).filter(Boolean))];
  const types = [...new Set(rows.map(row => row.courseType).filter(Boolean))];
  const visible = rows.filter(row => (university === 'All' || row.university === university)
    && (type === 'All' || row.courseType === type));
  const loading = courses.loading || scholarships.loading;
  const error = courses.error || scholarships.error;
  const date = value => Number.isNaN(new Date(value).getTime()) ? value : new Date(value).toLocaleDateString('en-GB');

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">University Deadlines</h1>
        <p className="text-xs text-slate-500 mt-2">Published application and scholarship deadlines.</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap gap-4">
        <select aria-label="University" value={university} onChange={e => setUniversity(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm">
          <option value="All">All Universities</option>
          {universities.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <select aria-label="Deadline type" value={type} onChange={e => setType(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm">
          <option value="All">All Types ({rows.length})</option>
          {types.map(value => <option key={value} value={value}>{value} ({rows.filter(row => row.courseType === value).length})</option>)}
        </select>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500"><tr>
            <th className="p-5">University</th><th className="p-5">Type</th>
            <th className="p-5">Application Deadline</th><th className="p-5">Scholarship Deadline</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map(row => <tr key={row.id}>
              <td className="p-5 font-bold text-slate-900">{row.university}</td>
              <td className="p-5 text-slate-600">{row.courseType}</td>
              <td className="p-5 text-slate-600">{date(row.appDeadline)}</td>
              <td className="p-5 text-slate-600">{date(row.scholarshipDeadline)}</td>
            </tr>)}
            {!visible.length && <tr><td colSpan="4" className="p-10 text-center text-slate-500">
              {loading ? 'Loading deadlines...' : error ? 'Deadlines could not be loaded.' : 'No deadlines published yet.'}
            </td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
