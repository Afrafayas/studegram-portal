import React, { useState } from 'react';
import ScholarshipDetailsModal from '../components/ScholarshipDetailsModal';

export default function Scholarships({ setActivePage }) {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarshipForDetails, setSelectedScholarshipForDetails] = useState(null);

  const scholarshipData = [
    // UK
    {
      id: 1,
      name: 'Great Scholarships',
      university: 'Anglia Ruskin University',
      country: 'United Kingdom',
      type: 'Merit-based',
      amount: '£10,000',
      eligibility: 'Passport holder of India, Pakistan, or Nigeria; Minimum 65% in Bachelor\'s degree.',
      deadline: '2027-05-31',
      gradient: 'from-blue-600 to-indigo-800'
    },
    {
      id: 2,
      name: 'Vice-Chancellor\'s Excellence Scholarship',
      university: 'University of Surrey',
      country: 'United Kingdom',
      type: 'Merit-based',
      amount: '£5,000',
      eligibility: 'First-class Honours equivalent in previous academic qualifications.',
      deadline: '2027-06-30',
      gradient: 'from-[#F5B025] to-[#0891B2]'
    },
    {
      id: 3,
      name: 'Coventry Academic Performance Scholarship',
      university: 'Coventry University',
      country: 'United Kingdom',
      type: 'Merit-based',
      amount: '£2,000',
      eligibility: 'Minimum cumulative GPA of 3.0 or national equivalent.',
      deadline: '2027-07-31',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      name: 'Hertfordshire International Scholarship',
      university: 'University of Hertfordshire',
      country: 'United Kingdom',
      type: 'Merit-based',
      amount: '£1,000 - £4,000',
      eligibility: 'Outstanding academic record and a personal statement explaining career goals.',
      deadline: '2027-08-15',
      gradient: 'from-emerald-500 to-teal-700'
    },
    // Canada
    {
      id: 5,
      name: 'Lester B. Pearson International Scholarship',
      university: 'University of Toronto',
      country: 'Canada',
      type: 'Merit/Need-based',
      amount: '100% Tuition + Living Cover',
      eligibility: 'Nominated by high school counselor; demonstrated leadership and community service.',
      deadline: '2027-01-15',
      gradient: 'from-red-500 to-rose-700'
    },
    {
      id: 6,
      name: 'Entrance Scholarships for Graduates',
      university: 'McGill University',
      country: 'Canada',
      type: 'Merit-based',
      amount: '$3,000 - $12,000 CAD',
      eligibility: 'Automatic consideration upon application; Top 5% of incoming student cohort.',
      deadline: '2027-03-01',
      gradient: 'from-purple-600 to-indigo-700'
    },
    {
      id: 7,
      name: 'UBC International Major Entrance Scholarship',
      university: 'University of British Columbia',
      country: 'Canada',
      type: 'Merit-based',
      amount: '$10,000 CAD/yr (Renewable)',
      eligibility: 'High academic achievers with strong extracurricular profile.',
      deadline: '2027-01-15',
      gradient: 'from-[#D99A1C] to-[#0ea5e9]'
    },
    // USA
    {
      id: 8,
      name: 'NYU Wagner Global Fellowships',
      university: 'New York University',
      country: 'United States',
      type: 'Merit-based',
      amount: '50% - 100% Tuition Cover',
      eligibility: 'Enrolled in a master\'s program; Exceptional leadership potential and academics.',
      deadline: '2026-12-15',
      gradient: 'from-fuchsia-600 to-purple-800'
    },
    {
      id: 9,
      name: 'Dean\'s Scholarship Award',
      university: 'Northeastern University',
      country: 'United States',
      type: 'Merit-based',
      amount: '$10,000 - $28,000 USD/yr',
      eligibility: 'Outstanding academic standing, top 10% in high school or university class.',
      deadline: '2027-01-01',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 10,
      name: 'Trustee Scholarship',
      university: 'Boston University',
      country: 'United States',
      type: 'Merit-based',
      amount: 'Full Tuition Fee Waiver',
      eligibility: 'Perfect 4.0 GPA or equivalent; Submitted essay showing creative perspectives.',
      deadline: '2026-12-01',
      gradient: 'from-rose-500 to-red-700'
    },
    // Australia
    {
      id: 11,
      name: 'Melbourne International Scholarship',
      university: 'University of Melbourne',
      country: 'Australia',
      type: 'Merit-based',
      amount: '$10,000 AUD or 100% Tuition',
      eligibility: 'Top high school grads; GPA requirement varies by country of origin.',
      deadline: '2026-12-31',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 12,
      name: 'Vice-Chancellor\'s Scholarships',
      university: 'University of Sydney',
      country: 'Australia',
      type: 'Merit-based',
      amount: '$5,000 - $40,000 AUD',
      eligibility: 'All international undergraduate and postgraduate applicants with top academic results.',
      deadline: '2027-01-15',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 13,
      name: 'Monash International Leadership Scholarship',
      university: 'Monash University',
      country: 'Australia',
      type: 'Merit-based',
      amount: '100% Tuition Cover',
      eligibility: 'Highest achieving international students; Assessed based on academic profile and SOP.',
      deadline: '2026-10-15',
      gradient: 'from-violet-600 to-indigo-800'
    },
    // Ireland
    {
      id: 14,
      name: 'Government of Ireland Research Scholarship',
      university: 'National Universities',
      country: 'Ireland',
      type: 'Research-based',
      amount: '€19,000 Stipend + Fees Cover',
      eligibility: 'Excellent research proposals for PhD or Master\'s by Research.',
      deadline: '2026-10-20',
      gradient: 'from-emerald-500 to-green-700'
    },
    {
      id: 15,
      name: 'UCD Global Excellence Scholarship',
      university: 'University College Dublin',
      country: 'Ireland',
      type: 'Merit-based',
      amount: '50% - 100% Tuition Cover',
      eligibility: 'Outstanding academic transcript, active community service, and personal essay.',
      deadline: '2027-02-28',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];

  // Country Flags Mapping
  const countryFlags = {
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'United States': '🇺🇸',
    'Australia': '🇦🇺',
    'Ireland': '🇮🇪'
  };

  // Get dynamic university list based on selected country
  const uniqueUniversities = [
    'All',
    ...new Set(
      scholarshipData
        .filter((s) => selectedCountry === 'All' || s.country === selectedCountry)
        .map((s) => s.university)
    )
  ];

  // Filtering logic
  const filteredScholarships = scholarshipData.filter((s) => {
    // Country Filter
    if (selectedCountry !== 'All' && s.country !== selectedCountry) return false;

    // University Filter
    if (selectedUniversity !== 'All' && s.university !== selectedUniversity) return false;

    // Type Filter
    if (selectedType !== 'All' && s.type !== selectedType) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = s.name.toLowerCase().includes(q);
      const matchesUni = s.university.toLowerCase().includes(q);
      const matchesElig = s.eligibility.toLowerCase().includes(q);
      return matchesName || matchesUni || matchesElig;
    }

    return true;
  });

  // Calculate Urgency level (Deadlines)
  const getDeadlineBadge = (deadlineStr) => {
    const today = new Date('2026-07-11'); // Local project time: 2026-07-11
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString('en-US', options);

    if (diffDays < 0) {
      return (
        <span className="text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          Expired ({formattedDate})
        </span>
      );
    } else if (diffDays <= 60) {
      return (
        <span className="text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          Closing Soon ({formattedDate})
        </span>
      );
    } else if (diffDays <= 120) {
      return (
        <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          Apply Now ({formattedDate})
        </span>
      );
    } else {
      return (
        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
          Open ({formattedDate})
        </span>
      );
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5] animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Scholarships Directory</h1>
          <p className="text-xs text-[#64748B] font-semibold mt-1">
            Browse merit, need, and research-based scholarships from global university partners.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] shadow-xs font-medium"
            placeholder="Search name, university, eligibility..."
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

      {/* Filters Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Country filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Destination Country</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedUniversity('All');
                }}
              >
                <option value="All">All Countries</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Australia">Australia</option>
                <option value="Ireland">Ireland</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* University filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Partner University</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
              >
                {uniqueUniversities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni === 'All' ? 'All Universities' : uni}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Scholarship type filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Scholarship Category</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Merit-based">Merit-based</option>
                <option value="Merit/Need-based">Merit/Need-based</option>
                <option value="Research-based">Research-based</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748B] font-bold px-1 border-b border-[#E2E8F0] pb-2">
        <span>{filteredScholarships.length} scholarships listed</span>
        <span>Filters applied: {selectedCountry} region</span>
      </div>

      {/* Scholarships Cards Grid */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200"
            >
              {/* Card Gradient Header */}
              <div className={`h-24 bg-gradient-to-r ${s.gradient} p-4 flex flex-col justify-between relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-white/20 backdrop-blur-md text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {s.type}
                  </span>
                  <span className="text-xl bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-lg select-none">
                    {countryFlags[s.country] || '🌍'}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white truncate leading-tight">{s.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* University Profile Info */}
                  <div>
                    <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-0.5">Offered By</span>
                    <span className="font-bold text-[#0F172A] text-xs">{s.university}</span>
                  </div>

                  {/* Value / Amount */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex justify-between items-center">
                    <div>
                      <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-0.5">Scholarship Value</span>
                      <span className="text-emerald-600 font-extrabold text-sm">{s.amount}</span>
                    </div>
                  </div>

                  {/* Eligibility Snippet */}
                  <div className="space-y-1">
                    <span className="block text-[8px] font-extrabold text-[#94A3B8] uppercase tracking-wider">Eligibility Criteria</span>
                    <p className="text-[11px] text-[#475569] font-semibold leading-relaxed line-clamp-3">
                      {s.eligibility}
                    </p>
                  </div>
                </div>

                {/* Deadline & Actions */}
                <div className="border-t border-slate-50 pt-3 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Deadline</span>
                    {getDeadlineBadge(s.deadline)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedScholarshipForDetails(s)}
                      className="flex-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-[#D99A1C] text-xs font-bold text-[#475569] py-2 rounded-xl text-center transition-all duration-150"
                    >
                      Check Criteria
                    </button>
                    <button
                      onClick={() => setActivePage && setActivePage('UniversityDeadline')}
                      className="flex-1 bg-[#D99A1C] hover:bg-[#C28410] hover:scale-[1.02] active:scale-95 text-xs font-bold text-white py-2 rounded-xl text-center transition-all duration-150 shadow-xs"
                    >
                      Deadlines
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-[#64748B] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#0F172A]">No Scholarships Found</h3>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              We couldn't find any scholarships matching your search query or filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCountry('All');
              setSelectedUniversity('All');
              setSelectedType('All');
              setSearchQuery('');
            }}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md inline-flex items-center gap-1.5"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Scholarship Details Modal */}
      <ScholarshipDetailsModal
        isOpen={!!selectedScholarshipForDetails}
        onClose={() => setSelectedScholarshipForDetails(null)}
        scholarship={selectedScholarshipForDetails}
      />
    </div>
  );
}
