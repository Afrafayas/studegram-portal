import React, { useState } from 'react';

export default function SearchCourses() {
  const [country, setCountry] = useState('United Kingdom');
  const [nationality, setNationality] = useState('India');
  const [university, setUniversity] = useState('All');
  const [courseType, setCourseType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualCourse, setManualCourse] = useState({
    courseUrl: '',
    universityName: '',
    courseName: '',
    intake: 'September 2026'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const allCourses = [
    // United Kingdom
    { id: 1, title: 'MSc in Computer Science (Artificial Intelligence)', university: 'Anglia Ruskin University', country: 'United Kingdom', level: 'Postgraduate', duration: '12 - 15 Months', intake: 'September 2026', fee: '£16,700/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },
    { id: 2, title: 'MBA with Professional Placement', university: 'Coventry University', country: 'United Kingdom', level: 'Postgraduate', duration: '24 Months', intake: 'September 2026', fee: '£19,850/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 3, title: 'BSc (Hons) Software Engineering', university: 'University of Surrey', country: 'United Kingdom', level: 'Undergraduate', duration: '3 Years', intake: 'September 2026', fee: '£22,400/yr', gradient: 'from-purple-500 to-pink-500' },
    { id: 4, title: 'MSc Data Science and Analytics', university: 'University of Hertfordshire', country: 'United Kingdom', level: 'Postgraduate', duration: '1 Year', intake: 'September 2026', fee: '£15,450/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },
    { id: 5, title: 'MA International Relations', university: 'Nottingham Trent University', country: 'United Kingdom', level: 'Postgraduate', duration: '12 Months', intake: 'January 2027', fee: '£16,000/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 6, title: 'BEng (Hons) Mechanical Engineering', university: 'Coventry University', country: 'United Kingdom', level: 'Undergraduate', duration: '3 Years', intake: 'September 2026', fee: '£18,250/yr', gradient: 'from-purple-500 to-pink-500' },
    { id: 7, title: 'International Foundation in Science', university: 'Anglia Ruskin University', country: 'United Kingdom', level: 'Foundation', duration: '9 Months', intake: 'September 2026', fee: '£12,200/yr', gradient: 'from-blue-500 to-indigo-600' },

    // Canada
    { id: 8, title: 'Master of Applied Computing (MScAC)', university: 'University of Toronto', country: 'Canada', level: 'Postgraduate', duration: '16 Months', intake: 'September 2026', fee: '$45,000 CAD/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },
    { id: 9, title: 'Master of Management in Finance', university: 'McGill University', country: 'Canada', level: 'Postgraduate', duration: '12 Months', intake: 'September 2026', fee: '$38,000 CAD/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 10, title: 'Bachelor of Computer Science (BCS)', university: 'University of British Columbia', country: 'Canada', level: 'Undergraduate', duration: '4 Years', intake: 'September 2026', fee: '$42,000 CAD/yr', gradient: 'from-purple-500 to-pink-500' },
    { id: 11, title: 'Master of Data Science', university: 'University of British Columbia', country: 'Canada', level: 'Postgraduate', duration: '10 Months', intake: 'September 2026', fee: '$48,000 CAD/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },

    // United States
    { id: 12, title: 'MS in Computer Science', university: 'New York University', country: 'United States', level: 'Postgraduate', duration: '2 Years', intake: 'September 2026', fee: '$58,000/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },
    { id: 13, title: 'MS in Information Systems', university: 'Northeastern University', country: 'United States', level: 'Postgraduate', duration: '18 - 24 Months', intake: 'September 2026', fee: '$52,000/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 14, title: 'BS in Economics', university: 'Boston University', country: 'United States', level: 'Undergraduate', duration: '4 Years', intake: 'September 2026', fee: '$55,000/yr', gradient: 'from-purple-500 to-pink-500' },

    // Australia
    { id: 15, title: 'Master of Information Technology', university: 'University of Melbourne', country: 'Australia', level: 'Postgraduate', duration: '2 Years', intake: 'February 2027', fee: '$44,000 AUD/yr', gradient: 'from-[#D99A1C] to-[#F5B025]' },
    { id: 16, title: 'Master of Commerce', university: 'University of Sydney', country: 'Australia', level: 'Postgraduate', duration: '18 Months', intake: 'February 2027', fee: '$46,000 AUD/yr', gradient: 'from-teal-500 to-emerald-500' },
    { id: 17, title: 'Bachelor of Engineering (Hons)', university: 'Monash University', country: 'Australia', level: 'Undergraduate', duration: '4 Years', intake: 'July 2026', fee: '$41,000 AUD/yr', gradient: 'from-purple-500 to-pink-500' }
  ];

  // Dynamically populate available universities for the selected country
  const availableUniversities = [
    'All',
    ...new Set(
      allCourses
        .filter((c) => c.country === country)
        .map((c) => c.university)
    )
  ];

  // Filtering logic
  const filteredCourses = allCourses.filter((c) => {
    // Country filter
    if (c.country !== country) return false;

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
        <span>{filteredCourses.length} courses found</span>
        <span>Showing results for {country}</span>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-200">
              {/* Top banner gradient */}
              <div className={`relative bg-gradient-to-r ${course.gradient} h-36 flex items-center justify-center overflow-hidden`}>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Play button overlay circle */}
                <button className="relative w-11 h-11 bg-white/20 hover:bg-[#D99A1C] hover:scale-110 text-white rounded-full flex items-center justify-center border border-white/20 transition-all duration-150 backdrop-blur-sm shadow-md">
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
                  <h3 className="text-xs font-bold text-[#0F172A] leading-snug group-hover:text-[#D99A1C] transition-colors">{course.title}</h3>
                </div>

                {/* specs & Apply Now action on hover */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] font-semibold border-t border-slate-50 pt-3">
                    <span>Duration: {course.duration}</span>
                    <span className="text-[#0F172A]">{course.fee}</span>
                  </div>

                  {/* Apply Now button showing/transitioning on card hover */}
                  <div className="h-9 relative overflow-hidden">
                    <button className="w-full bg-[#D99A1C] hover:bg-[#C28410] hover:scale-[1.02] text-white text-xs font-bold py-2 rounded-xl transition-all duration-150 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 shadow-sm">
                      Apply Now
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
            <h3 className="text-sm font-bold text-[#0F172A]">No Courses Found</h3>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              We couldn't find any courses matching your criteria. Try adjusting the filters or search keywords.
            </p>
          </div>
          <button
            onClick={() => {
              setUniversity('All');
              setCourseType('All');
              setSearchQuery('');
            }}
            className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md inline-flex items-center gap-1.5"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Course Manually Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-[#0F172A]">Can't find the course you're looking for?</h3>
          <p className="text-xs text-[#64748B] font-semibold">Request a new university course to be added manually to our portal database.</p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setShowManualModal(true);
          }}
          className="bg-[#D99A1C] hover:bg-[#C28410] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] shadow-md shrink-0 uppercase tracking-wider"
        >
          Add Course Manually
        </button>
      </div>

      {/* Manual Course Request Modal */}
      {showManualModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => {
            setShowManualModal(false);
            setIsSubmitted(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative flex flex-col p-6 space-y-4" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                {isSubmitted ? "Request Submitted" : "Add Course Manually"}
              </h3>
              <button
                onClick={() => {
                  setShowManualModal(false);
                  setIsSubmitted(false);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-[#10B981] rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider">Success!</p>
                <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                  Course request submitted successfully!
                </p>
                <button
                  onClick={() => {
                    setShowManualModal(false);
                    setIsSubmitted(false);
                  }}
                  className="mt-4 bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubmitted(true);
                  setManualCourse({
                    courseUrl: '',
                    universityName: '',
                    courseName: '',
                    intake: 'September 2026'
                  });
                }} 
                className="space-y-4"
              >
                {/* Course URL */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Course URL</label>
                  <input
                    required
                    type="url"
                    placeholder="Paste university course link here"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white"
                    value={manualCourse.courseUrl}
                    onChange={(e) => setManualCourse({...manualCourse, courseUrl: e.target.value})}
                  />
                </div>
                {/* University Name */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">University Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter university name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white"
                    value={manualCourse.universityName}
                    onChange={(e) => setManualCourse({...manualCourse, universityName: e.target.value})}
                  />
                </div>
                {/* Course Name */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Course Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter course name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white"
                    value={manualCourse.courseName}
                    onChange={(e) => setManualCourse({...manualCourse, courseName: e.target.value})}
                  />
                </div>
                {/* Intake Select */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1">Intake</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] cursor-pointer appearance-none pr-8 font-semibold"
                      value={manualCourse.intake}
                      onChange={(e) => setManualCourse({...manualCourse, intake: e.target.value})}
                    >
                      <option value="September 2026">September 2026</option>
                      <option value="January 2027">January 2027</option>
                      <option value="September 2027">September 2027</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#D99A1C] hover:bg-[#C28410] text-white font-bold py-2 rounded-xl text-xs transition-all duration-150 hover:scale-[1.02] shadow-md uppercase tracking-wider mt-4"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
