import { ActionButton } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import useApiCollection from '../hooks/useApiCollection';
import { mapCourse } from '../utils/resourceData';

export default function SearchCourses({ onApplyCourse }) {
  const toast = useToast();
  const [country, setCountry] = useState('All');
  const [nationality, setNationality] = useState('India');
  const [university, setUniversity] = useState('All');
  const [courseType, setCourseType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  const { records: courseRecords, loading, error } = useApiCollection('/courses');
  const allCourses = courseRecords.map(mapCourse);

  // Dynamically populate available universities for the selected country
  const availableUniversities = [
    'All',
    ...new Set(
      allCourses
        .filter((c) => country === 'All' || c.country === country)
        .map((c) => c.university)
    )
  ];

  // Filtering logic
  const filteredCourses = allCourses.filter((c) => {
    // Country filter
    if (country !== 'All' && c.country !== country) return false;

    // University filter
    if (university !== 'All' && c.university !== university) return false;

    // Course level filter
    if (courseType !== 'All' && c.level !== courseType) return false;

    // Search query filter (matches title, university, or duration/fees/intake)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesUni = c.university.toLowerCase().includes(q);
      return matchesTitle || matchesUni;
    }

    return true;
  });

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {loading && <p className="text-sm text-slate-500">Loading courses...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Search Courses</h1>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Explore and filter through our active list of course offerings.</p>
      </div>

      {/* Filter Card: white rounded-2xl, 4 dropdowns + search in one row */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Query input */}
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Course Search</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white transition-all"
              placeholder="Search course title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* University Country */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">University Country</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setUniversity('All');
                }}
              >
                <option value="All">All Countries</option>
                {[...new Set(allCourses.map(c => c.country).filter(Boolean))].map(value => <option key={value} value={value}>{value}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Student Nationality */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Student Nationality</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              >
                <option value="India">India</option>
                <option value="Nepal">Nepal</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Pakistan">Pakistan</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* University Name */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">University</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                {availableUniversities.map((uniName) => (
                  <option key={uniName} value={uniName}>
                    {uniName === 'All' ? 'All Universities' : uniName}
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

          {/* Course Level */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Course Level</label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
              >
                <option value="All">All Levels</option>
                {[...new Set(allCourses.map(c => c.level).filter(Boolean))].map(value => <option key={value} value={value}>{value}</option>)}
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

      {/* Result Metrics */}
      <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold px-1">
        <span>{filteredCourses.length} courses found</span>
        <span>Showing results for {country}</span>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isBlueTheme = course.id % 4 === 0;
            const topBorderClass = isBlueTheme ? 'border-t-[#2563EB]' : 'border-t-[#D99A1C]';

            return (
              <div
                key={course.id}
                className={`bg-white border border-[#E2E8F0] border-t-4 ${topBorderClass} rounded-2xl shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-200`}
              >
                {/* Header Panel */}
                <div className="h-32 bg-slate-950 p-4 flex flex-col justify-between relative border-b border-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-white/10 text-white border border-white/15 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {course.duration}
                    </span>
                    <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-lg border border-white/10 font-bold uppercase tracking-wider">
                      {course.intake}
                    </span>
                  </div>
                  <div className="text-white">
                    <h3 className="font-extrabold text-sm truncate leading-tight pr-6">{course.title}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="truncate">{course.university}</span>
                    </p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Detailed key-value rows */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Duration</span>
                      <span className="font-bold text-[#0F172A]">{course.duration}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider mb-0.5">Est. Fees</span>
                      <span className="font-bold text-[#0F172A]">{course.fee}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <ActionButton
                      onClick={() => setSelectedCourseDetails(course)}
                      className="flex-1 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 py-2.5 rounded-xl text-center transition-all duration-150"
                    >
                      Check Specs
                    </ActionButton>
                    <ActionButton
                      onClick={() => {
                        if (onApplyCourse) {
                          onApplyCourse();
                        } else {
                          toast.info(`Initiating student application file for ${course.title} at ${course.university}.`);
                        }
                      }}
                      className="flex-1 bg-[#D99A1C] hover:bg-[#B87C0E] hover:scale-[1.01] active:scale-95 text-xs font-bold text-white py-2.5 rounded-xl text-center transition-all duration-150 shadow-xs"
                    >
                      Apply Now
                    </ActionButton>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#0F172A]">No Courses Found</h3>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              We couldn't find any courses matching your criteria. Try adjusting the filters or search keywords.
            </p>
          </div>
          <ActionButton
            onClick={() => {
              setUniversity('All');
              setCourseType('All');
              setSearchQuery('');
            }}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md inline-flex items-center gap-1.5"
          >
            Reset Filters
          </ActionButton>
        </div>
      )}

      <p className="text-xs text-slate-500">If a course is missing, please contact your administrator.</p>
      {selectedCourseDetails && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-label="Course specifications" className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="font-bold text-slate-900">{selectedCourseDetails.title}</h2>
            <p className="text-sm text-slate-600">{selectedCourseDetails.university}</p>
            <p className="text-sm text-slate-600">{selectedCourseDetails.description || 'No course description provided.'}</p>
            <p className="text-xs text-slate-500">Duration: {selectedCourseDetails.duration || 'Not provided'}</p>
            <p className="text-xs text-slate-500">Fees: {selectedCourseDetails.fee}</p>
            <p className="text-xs text-slate-500">Intakes: {selectedCourseDetails.intake || 'Not provided'}</p>
            <ActionButton onClick={() => setSelectedCourseDetails(null)} className="bg-[#D99A1C] text-white rounded-xl px-5 py-2 text-xs font-bold">Close</ActionButton>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
