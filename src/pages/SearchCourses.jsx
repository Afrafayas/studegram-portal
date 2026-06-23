import React, { useState } from 'react';

export default function SearchCourses() {
  const [country, setCountry] = useState('United Kingdom');
  const [nationality, setNationality] = useState('India');
  const [university, setUniversity] = useState('All');
  const [courseType, setCourseType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    { id: 1, title: 'MSc in Computer Science (Artificial Intelligence)', university: 'Anglia Ruskin University', duration: '12 - 15 Months', intake: 'September 2026', fee: '£16,700/yr', gradient: 'from-[#6366F1] to-[#06B6D4]' },
    { id: 2, title: 'MBA with Professional Placement', university: 'Coventry University', duration: '24 Months', intake: 'September 2026', fee: '£19,850/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 3, title: 'BSc (Hons) Software Engineering', university: 'University of Surrey', duration: '3 Years', intake: 'September 2026', fee: '£22,400/yr', gradient: 'from-purple-500 to-pink-500' },
    { id: 4, title: 'MSc Data Science and Analytics', university: 'University of Hertfordshire', duration: '1 Year', intake: 'September 2026', fee: '£15,450/yr', gradient: 'from-[#6366F1] to-[#06B6D4]' },
    { id: 5, title: 'MA International Relations', university: 'Nottingham Trent University', duration: '12 Months', intake: 'January 2027', fee: '£16,000/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 6, title: 'BEng (Hons) Mechanical Engineering', university: 'Coventry University', duration: '3 Years', intake: 'September 2026', fee: '£18,250/yr', gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="flex-1 p-8 space-y-6 bg-[#F0F2F5]">
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white transition-all"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Australia">Australia</option>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                <option value="All">All Universities</option>
                <option value="Anglia Ruskin University">Anglia Ruskin University</option>
                <option value="Coventry University">Coventry University</option>
                <option value="University of Surrey">University of Surrey</option>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Foundation">Foundation</option>
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
        <span>103,462 courses found</span>
        <span>Showing results for {country}</span>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-200">
            {/* Top banner gradient */}
            <div className={`relative bg-gradient-to-r ${course.gradient} h-36 flex items-center justify-center overflow-hidden`}>
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

              {/* Play button overlay circle */}
              <button className="relative w-11 h-11 bg-white/20 hover:bg-[#6366F1] hover:scale-110 text-white rounded-full flex items-center justify-center border border-white/20 transition-all duration-150 backdrop-blur-sm shadow-md">
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* Top Right Intake Chip */}
              <span className="absolute top-3 right-3 bg-white/95 text-[#0F172A] text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm select-none">
                {course.intake}
              </span>
            </div>

            {/* Course Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[10px] font-extrabold text-[#64748B] tracking-wider uppercase mb-1">{course.university}</p>
                <h3 className="text-xs font-bold text-[#0F172A] leading-snug group-hover:text-[#6366F1] transition-colors">{course.title}</h3>
              </div>

              {/* specs & Apply Now action on hover */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-[#64748B] font-semibold border-t border-slate-50 pt-3">
                  <span>Duration: {course.duration}</span>
                  <span className="text-[#0F172A]">{course.fee}</span>
                </div>

                {/* Apply Now button showing/transitioning on card hover */}
                <div className="h-9 relative overflow-hidden">
                  <button className="w-full bg-[#6366F1] hover:bg-[#5053e3] hover:scale-[1.02] text-white text-xs font-bold py-2 rounded-xl transition-all duration-150 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-sm">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
