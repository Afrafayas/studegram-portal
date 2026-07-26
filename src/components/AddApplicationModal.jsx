import React, { useState, useEffect } from 'react';

export default function AddApplicationModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [stepNumber, setStepNumber] = useState(1);
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('partner_token');

      Promise.all([
        fetch('/api/students', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
        fetch('/api/universities', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
        fetch('/api/courses', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
      ])
      .then(([studentsRes, universitiesRes, coursesRes]) => {
        setStudents(studentsRes.data || []);
        setUniversities(universitiesRes.data || []);
        setCourses(coursesRes.data || []);
      })
      .catch(err => {
        console.error('Error loading application options:', err);
        setError('Failed to load students, universities, or courses from server.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleResetAndClose = () => {
    setSelectedStudent('');
    setSelectedUniversity('');
    setSelectedCourse('');
    setStepNumber(1);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedUniversity || !selectedCourse) {
      setError('Please select a student, university, and course.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = await onSubmit({
        studentId: selectedStudent,
        universityId: selectedUniversity,
        courseId: selectedCourse
      });
      if (success) {
        setStepNumber(4); // Success step
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter courses by selected university
  const filteredCourses = courses.filter(course => {
    if (!selectedUniversity) return false;
    const courseUnivId = course.university?._id || course.university;
    return courseUnivId === selectedUniversity;
  });

  return (
    <div
      onClick={handleResetAndClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Add New Application
          </h2>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-8 flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex gap-3 text-xs shadow-sm mb-6">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-1">
                <p className="font-bold text-[10px] text-red-800 uppercase tracking-wider">Error</p>
                <p className="leading-relaxed font-semibold">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <svg className="animate-spin h-8 w-8 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs text-[#64748B] font-semibold">Loading resources...</span>
            </div>
          ) : stepNumber === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">New Application Details</h3>
                <p className="text-[11px] text-[#64748B] font-semibold">Select the student profile, target university, and program course.</p>
              </div>

              <div className="space-y-4">
                {/* Student Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Select Student</label>
                  <div className="relative">
                    <select
                      required
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="">-- Choose Student --</option>
                      {students.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} ({student.passportNo || 'No Passport'})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* University Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Select University</label>
                  <div className="relative">
                    <select
                      required
                      value={selectedUniversity}
                      onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                        setSelectedCourse(''); // Reset course
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="">-- Choose University --</option>
                      {universities.map(univ => (
                        <option key={univ._id} value={univ._id}>
                          {univ.name} ({univ.country || 'Unknown'})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Course Dropdown */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Select Course</label>
                  <div className="relative">
                    <select
                      required
                      disabled={!selectedUniversity}
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedUniversity ? '-- Please Select a University First --' : '-- Choose Course --'}
                      </option>
                      {filteredCourses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.title} ({course.degreeLevel || 'N/A'})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedUniversity && filteredCourses.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1">⚠️ No courses registered under this university in the database.</p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedStudent || !selectedUniversity || !selectedCourse}
                className="w-full bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.02] text-white font-bold py-3 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-6 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          ) : (
            /* STEP 4: Success Screen */
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <rect x="22" y="52" width="8" height="16" rx="4" fill="#64748B" />
                <rect x="42" y="52" width="8" height="16" rx="4" fill="#64748B" />
                <circle cx="35" cy="42" r="20" fill="#94A3B8" />
                <circle cx="52" cy="38" r="14" fill="#94A3B8" />
                <rect x="28" y="52" width="8" height="16" rx="4" fill="#94A3B8" />
                <rect x="48" y="52" width="8" height="16" rx="4" fill="#94A3B8" />
                <circle cx="46" cy="34" r="6" fill="#F1F5F9" />
                <circle cx="46" cy="34" r="4" fill="#F472B6" />
                <circle cx="56" cy="34" r="1.5" fill="#0F172A" />
                <path d="M 64 42 C 72 42 76 46 76 50 C 76 54 72 54 70 51" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 16 42 Q 10 40 12 46" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              <h3 className="text-base font-bold text-[#10B981] mt-2">🎉 Application Submitted!</h3>
              <p className="text-xs text-[#64748B] font-semibold max-w-xs leading-relaxed">
                Your application has been logged in the Studegram system. Our handlers will verify the information.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="bg-[#D99A1C] hover:bg-[#C28410] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-4"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
