import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function EditApplicationModal({ isOpen, onClose, application, onUpdateSuccess }) {
  if (!isOpen || !application) return null;

  const toast = useToast();
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notes, setNotes] = useState('');

  // Load universities and courses
  useEffect(() => {
    if (isOpen && application) {
      setIsLoading(true);
      setError('');

      Promise.all([
        API.get('/universities').then(res => res.data),
        API.get('/courses').then(res => res.data)
      ])
      .then(([universitiesRes, coursesRes]) => {
        setUniversities(universitiesRes.data || []);
        setCourses(coursesRes.data || []);

        // Prepopulate fields from the active application
        const appUnivId = application.university?._id || application.university || '';
        const appCourseId = application.course?._id || application.course || '';
        setSelectedUniversity(appUnivId);
        setSelectedCourse(appCourseId);
        setNotes(application.notes || '');
      })
      .catch(err => {
        console.error('Error loading options:', err);
        setError('Failed to load universities or courses from server.');
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, application]);

  // Reset selected course if university changes
  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedCourse('');
  };

  // Filter courses by selected university
  const filteredCourses = courses.filter(course => {
    if (!selectedUniversity) return false;
    const courseUnivId = course.university?._id || course.university;
    return courseUnivId === selectedUniversity;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUniversity || !selectedCourse) {
      setError('Please select a university and course.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await API.put(`/applications/${application.id}`, {
        university: selectedUniversity,
        course: selectedCourse,
        notes: notes.trim()
      });

      const data = res.data;
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to update application');
      }

      toast.success('Application updated successfully!');
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Modal Header */}
        <div className="bg-slate-950 p-6 text-white border-b border-slate-900 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">Edit Application Details</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Update course choice and application comments for the student.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-bold text-slate-500">Loading options from server...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {/* Student Name (Read Only) */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Student Name (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={application.studentName}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#64748B] font-bold outline-none"
                />
              </div>

              {/* University Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Destination University *</label>
                <div className="relative">
                  <select
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none"
                  >
                    <option value="" disabled>Select University</option>
                    {universities.map((uni) => (
                      <option key={uni._id} value={uni._id}>{uni.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Course Program *</label>
                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                    disabled={!selectedUniversity}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>Select Course</option>
                    {filteredCourses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title} ({course.degreeLevel || 'UG'})</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Notes / Comments */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Comments / Notes</label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white font-semibold text-[#0F172A] resize-none"
                  placeholder="Add any comments or notes for this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#475569] py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUniversity || !selectedCourse}
                  className="flex-1 bg-[#D99A1C] hover:bg-[#C28410] disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                >
                  {isSubmitting ? 'Saving changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
