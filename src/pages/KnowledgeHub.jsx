import { useState } from 'react';
import useApiCollection from '../hooks/useApiCollection';

export default function KnowledgeHub() {
  const { records: universities, loading, error } = useApiCollection('/universities');
  const { records: notices, loading: guidesLoading, error: guidesError } = useApiCollection('/notices');
  const [country, setCountry] = useState('All');
  const [search, setSearch] = useState('');
  const countries = [...new Set(universities.map(u => u.country).filter(Boolean))];
  const visible = universities.filter(u => (country === 'All' || u.country === country)
    && `${u.name} ${u.city || ''} ${u.description || ''}`.toLowerCase().includes(search.toLowerCase()));
  const guides = notices.filter(n => n.status === 'Active' && ['All', 'Agents'].includes(n.targetAudience)
    && /knowledge|guide|visa|policy/i.test(n.category || ''));

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Hub</h1>
        <p className="text-xs text-slate-500 mt-2">Published university information and guidance.</p>
      </div>
      {loading && <p className="text-sm text-slate-500">Loading information...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-4 p-5 bg-white border border-slate-200 rounded-2xl">
        <input aria-label="Search university information" placeholder="Search universities..." value={search}
          onChange={e => setSearch(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm flex-1" />
        <select aria-label="Country" value={country} onChange={e => setCountry(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm">
          <option value="All">All Countries</option>
          {countries.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visible.map(university => (
          <article key={university._id} className="bg-white border border-slate-200 border-t-4 border-t-[#D99A1C] rounded-2xl p-6 space-y-3">
            <h2 className="font-bold text-slate-900">{university.name}</h2>
            <p className="text-xs text-slate-500">{[university.city, university.country].filter(Boolean).join(', ')}</p>
            {university.ranking && <p className="text-xs text-slate-600">Ranking: {university.ranking}</p>}
            <p className="text-sm text-slate-600 whitespace-pre-line">{university.description || 'No information published yet.'}</p>
            {!!university.requirements?.length && <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              {university.requirements.map((requirement, index) => <li key={index}>{requirement}</li>)}
            </ul>}
          </article>
        ))}
      </div>
      {!loading && !error && !visible.length && <p className="text-sm text-slate-500">No university information available.</p>}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-slate-900">Published Guides</h2>
        {guidesLoading && <p className="text-sm text-slate-500">Loading guides...</p>}
        {guidesError && <p role="alert" className="text-sm text-red-600">{guidesError}</p>}
        {!guidesLoading && !guidesError && !guides.length && <p className="text-sm text-slate-500">No guides published yet.</p>}
        {guides.map(guide => <article key={guide._id} className="space-y-2 border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900">{guide.title}</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">{guide.content}</p>
        </article>)}
      </section>
    </div>
  );
}
