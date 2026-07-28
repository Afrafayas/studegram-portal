import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Universities({ setActivePage }) {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const countries = [
    { name: 'All', icon: '🌍' },
    { name: 'United Kingdom', icon: '🇬🇧' },
    { name: 'Canada', icon: '🇨🇦' },
    { name: 'United States', icon: '🇺🇸' },
    { name: 'Australia', icon: '🇦🇺' },
    { name: 'Germany', icon: '🇩🇪' }
  ];

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await API.get('/universities');
        const data = res.data;
        if (data.success) {
          // Pre-process some fields for the UI map (since DB might not have popularCourses array directly attached)
          const mappedUnis = data.data.map(u => ({
            ...u,
            popularCourses: u.courses ? u.courses.map(c => typeof c === 'object' ? c.title : c) : [],
            badge: u.ranking ? `Ranked ${u.ranking}` : 'Top Choice',
            badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            rating: '4.8',
            fee: u.courses && u.courses.length > 0 ? (typeof u.courses[0] === 'object' ? u.courses[0].tuitionFee : 'Varies') : 'Varies',
            gradient: 'from-[#0ea5e9] to-[#0d9488]'
          }));
          setUniversities(mappedUnis);
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);


  // Filtering logic
  const filteredUniversities = universities.filter((uni) => {
    const matchesCountry = selectedCountry === 'All' || uni.country === selectedCountry;
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.popularCourses.some((course) => course.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5] animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Partner Universities</h1>
          <p className="text-xs text-[#64748B] font-semibold mt-1">
            Browse global universities, rankings, fees, and program intakes.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] shadow-xs font-medium"
            placeholder="Search by name, city, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Country Filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        {countries.map((c) => {
          const isActive = selectedCountry === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedCountry(c.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 border shadow-xs select-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#D99A1C] to-[#F5B025] text-white border-transparent'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Statistics info banner */}
      <div className="flex items-center justify-between text-xs text-[#64748B] font-bold px-1 border-b border-[#E2E8F0] pb-2">
        <span>Showing {filteredUniversities.length} universities</span>
        {selectedCountry !== 'All' && <span>Selected region: {selectedCountry}</span>}
      </div>

      {/* Universities Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12"><svg className="animate-spin h-8 w-8 text-[#D99A1C]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>
      ) : filteredUniversities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => {
            const isBlueTheme = uni.id % 4 === 0;
            const topBorderClass = isBlueTheme ? 'border-t-[#2563EB]' : 'border-t-[#D99A1C]';
            const starColorClass = isBlueTheme ? 'text-[#2563EB]' : 'text-[#D99A1C]';
            
            return (
              <div
                key={uni.id}
                className={`bg-white border border-[#E2E8F0] border-t-4 ${topBorderClass} rounded-2xl shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-200`}
              >
                {/* Header Panel */}
                <div className="h-24 bg-slate-950 p-4 flex flex-col justify-between relative border-b border-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-white/10 text-white border border-white/15 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {uni.ranking}
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 text-white px-2 py-0.5 rounded-lg text-xs font-bold border border-white/10">
                      <svg className={`w-3.5 h-3.5 fill-current ${starColorClass}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{uni.rating}</span>
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="font-extrabold text-sm truncate leading-tight">{uni.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{uni.city}, {uni.country}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Stats / Badges */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${uni.badgeColor}`}>
                        {uni.badge}
                      </span>
                    </div>
                    
                    {/* Detailed key-value rows */}
                    <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3">
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Intakes</span>
                        <span className="font-bold text-[#0F172A]">{uni.intake}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Est. Fees</span>
                        <span className="font-bold text-[#0F172A]">{uni.fee}</span>
                      </div>
                    </div>

                    {/* Popular Courses */}
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Popular Courses</span>
                      <div className="flex flex-col gap-1">
                        {uni.popularCourses.map((course, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#475569] font-semibold">
                            <span className="w-1 h-1 rounded-full bg-[#D99A1C] shrink-0" />
                            <span className="truncate">{course}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick actions inside card */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setActivePage && setActivePage('SearchCourses')}
                      className="flex-1 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 py-2.5 rounded-xl text-center transition-all duration-150"
                    >
                      View Courses
                    </button>
                    <button
                      onClick={() => setActivePage && setActivePage('UniversityDeadline')}
                      className="flex-1 bg-[#D99A1C] hover:bg-[#B87C0E] hover:scale-[1.01] active:scale-95 text-xs font-bold text-white py-2.5 rounded-xl text-center transition-all duration-150 shadow-xs"
                    >
                      Deadlines
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-[#64748B] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#0F172A]">No Universities Found</h3>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              We couldn't find any universities matching your search query or region filter. Please try a different query.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCountry('All');
              setSearchQuery('');
            }}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md inline-flex items-center gap-1.5"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
