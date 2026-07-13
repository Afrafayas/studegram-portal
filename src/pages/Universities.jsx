import React, { useState } from 'react';

export default function Universities({ setActivePage }) {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const countries = [
    { name: 'All', icon: '🌍' },
    { name: 'United Kingdom', icon: '🇬🇧' },
    { name: 'Canada', icon: '🇨🇦' },
    { name: 'United States', icon: '🇺🇸' },
    { name: 'Australia', icon: '🇦🇺' },
    { name: 'Germany', icon: '🇩🇪' }
  ];

  const universities = [
    // UK
    {
      id: 1,
      name: 'Anglia Ruskin University',
      city: 'Chelmsford & Cambridge',
      country: 'United Kingdom',
      ranking: '#351-400 Global',
      intake: 'Sep, Jan, May',
      fee: '£16,700/yr',
      rating: '4.5',
      badge: 'Popular Choice',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      popularCourses: ['MSc Computer Science (AI)', 'MBA with Placement'],
      gradient: 'from-[#D99A1C] to-[#4F46E5]'
    },
    {
      id: 2,
      name: 'University of Surrey',
      city: 'Guildford',
      country: 'United Kingdom',
      ranking: '#244 Global',
      intake: 'September, January',
      fee: '£22,400/yr',
      rating: '4.8',
      badge: 'Top Ranked',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      popularCourses: ['International Hotel Management', 'Software Engineering'],
      gradient: 'from-[#F5B025] to-[#0891B2]'
    },
    {
      id: 3,
      name: 'Coventry University',
      city: 'Coventry',
      country: 'United Kingdom',
      ranking: '#501-600 Global',
      intake: 'Sep, Jan, May',
      fee: '£19,850/yr',
      rating: '4.3',
      badge: 'High Acceptance',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      popularCourses: ['MBA Global Business', 'Mechanical Engineering'],
      gradient: 'from-[#EC4899] to-[#D946EF]'
    },
    {
      id: 4,
      name: 'University of Hertfordshire',
      city: 'Hatfield',
      country: 'United Kingdom',
      ranking: '#601-800 Global',
      intake: 'September, January',
      fee: '£15,450/yr',
      rating: '4.2',
      badge: 'Affordable',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
      popularCourses: ['Data Science & Analytics', 'Cyber Security MSc'],
      gradient: 'from-[#10B981] to-[#059669]'
    },
    // Canada
    {
      id: 5,
      name: 'University of Toronto',
      city: 'Toronto',
      country: 'Canada',
      ranking: '#21 Global',
      intake: 'September',
      fee: '$45,000 CAD/yr',
      rating: '4.9',
      badge: 'Ivy League Equivalent',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      popularCourses: ['Applied Computing MSc', 'MBA Rotman School'],
      gradient: 'from-[#D99A1C] to-[#F5B025]'
    },
    {
      id: 6,
      name: 'McGill University',
      city: 'Montreal',
      country: 'Canada',
      ranking: '#30 Global',
      intake: 'September, January',
      fee: '$38,000 CAD/yr',
      rating: '4.8',
      badge: 'Research Focused',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      popularCourses: ['Master of Management', 'Computer Engineering'],
      gradient: 'from-[#8B5CF6] to-[#7C3AED]'
    },
    {
      id: 7,
      name: 'University of British Columbia',
      city: 'Vancouver',
      country: 'Canada',
      ranking: '#34 Global',
      intake: 'September, January',
      fee: '$40,000 CAD/yr',
      rating: '4.8',
      badge: 'Beautiful Campus',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
      popularCourses: ['Data Science', 'Sauder MBA'],
      gradient: 'from-[#EF4444] to-[#F43F5E]'
    },
    // USA
    {
      id: 8,
      name: 'New York University',
      city: 'New York City',
      country: 'United States',
      ranking: '#38 Global',
      intake: 'September, January',
      fee: '$58,000/yr',
      rating: '4.9',
      badge: 'Global Prestige',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      popularCourses: ['MS in Computer Science', 'MBA Stern School'],
      gradient: 'from-[#8B5CF6] to-[#D946EF]'
    },
    {
      id: 9,
      name: 'Northeastern University',
      city: 'Boston',
      country: 'United States',
      ranking: '#53 Global',
      intake: 'September, January',
      fee: '$52,000/yr',
      rating: '4.6',
      badge: 'Co-op Program Leader',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-100',
      popularCourses: ['Information Systems MS', 'Bioengineering'],
      gradient: 'from-[#0ea5e9] to-[#2563eb]'
    },
    {
      id: 10,
      name: 'Boston University',
      city: 'Boston',
      country: 'United States',
      ranking: '#93 Global',
      intake: 'September, January',
      fee: '$55,000/yr',
      rating: '4.5',
      badge: 'Top Placement',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      popularCourses: ['MA Economics', 'MS Project Management'],
      gradient: 'from-[#10B981] to-[#3B82F6]'
    },
    // Australia
    {
      id: 11,
      name: 'University of Melbourne',
      city: 'Melbourne',
      country: 'Australia',
      ranking: '#14 Global',
      intake: 'February, July',
      fee: '$44,000 AUD/yr',
      rating: '4.8',
      badge: '#1 in Australia',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
      popularCourses: ['Master of Information Technology', 'Biomedicine'],
      gradient: 'from-[#F43F5E] to-[#E11D48]'
    },
    {
      id: 12,
      name: 'University of Sydney',
      city: 'Sydney',
      country: 'Australia',
      ranking: '#19 Global',
      intake: 'February, July',
      fee: '$46,000 AUD/yr',
      rating: '4.7',
      badge: 'Highly Employable',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      popularCourses: ['Master of Commerce', 'Software Engineering'],
      gradient: 'from-[#F59E0B] to-[#D97706]'
    },
    // Germany
    {
      id: 13,
      name: 'Technical University of Munich',
      city: 'Munich',
      country: 'Germany',
      ranking: '#37 Global',
      intake: 'October, April',
      fee: '€0 - €4,000/sem',
      rating: '4.8',
      badge: 'Low Tuition / Elite',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      popularCourses: ['MSc Informatics', 'Robotics & AI'],
      gradient: 'from-[#0ea5e9] to-[#0d9488]'
    },
    {
      id: 14,
      name: 'Ludwig Maximilian University',
      city: 'Munich',
      country: 'Germany',
      ranking: '#54 Global',
      intake: 'October, April',
      fee: '€0/semester',
      rating: '4.7',
      badge: 'Tuition Free',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      popularCourses: ['Master of Data Science', 'Physics MSc'],
      gradient: 'from-[#D99A1C] to-[#3B82F6]'
    }
  ];

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
      {filteredUniversities.length > 0 ? (
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
