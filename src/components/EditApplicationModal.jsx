import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function EditApplicationModal({ isOpen, onClose, application, onUpdateSuccess }) {
  if (!isOpen || !application) return null;

  const toast = useToast();
  const [activeTab, setActiveTab] = useState('application');

  // Application fields
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [notes, setNotes] = useState('');

  // Student fields
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentPassport, setStudentPassport] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [studentAddress, setStudentAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && application) {
      setActiveTab('application');
      setIsLoading(true);
      setError('');

      Promise.all([
        API.get('/universities').then(res => res.data),
        API.get('/courses').then(res => res.data)
      ])
      .then(([uniRes, courseRes]) => {
        setUniversities(uniRes.data || []);
        setCourses(courseRes.data || []);

        // Prepopulate application fields
        setSelectedUniversity(application.university?._id || application.university || '');
        setSelectedCourse(application.course?._id || application.course || '');
        setNotes(application.notes || '');

        // Prepopulate student fields
        const s = application.student || {};
        setStudentName(s.name || '');
        setStudentEmail(s.email || '');
        setStudentPhone(s.phone || '');
        setStudentPassport(s.passportNo || '');
        setStudentDob(s.dob || '');
        setStudentGender(s.gender || '');
        setStudentAddress(s.address || '');
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError('Failed to load data from server.');
      })
      .finally(() => setIsLoading(false));
    }
  }, [isOpen, application]);

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedCourse('');
  };

  const filteredCourses = courses.filter(course => {
    if (!selectedUniversity) return false;
    const courseUnivId = course.university?._id || course.university;
    return courseUnivId === selectedUniversity;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUniversity || !selectedCourse) {
      setError('Please select a university and course.');
      setActiveTab('application');
      return;
    }
    if (!studentName.trim() || !studentEmail.trim() || !studentPhone.trim()) {
      setError('Student name, email and phone are required.');
      setActiveTab('student');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const studentId = application.student?._id || application.student;

      // Run both API calls in parallel
      await Promise.all([
        API.put(`/applications/${application.id}`, {
          university: selectedUniversity,
          course: selectedCourse,
          notes: notes.trim()
        }),
        studentId
          ? API.put(`/students/${studentId}`, {
              name: studentName.trim(),
              email: studentEmail.trim(),
              phone: studentPhone.trim(),
              passportNo: studentPassport.trim(),
              dob: studentDob.trim(),
              gender: studentGender,
              address: studentAddress.trim()
            })
          : Promise.resolve()
      ]);

      toast.success('Application & student details updated successfully!');
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white transition-all";
  const labelClass = "block text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">Edit Application</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {application.studentName} &middot; {application.camsId}
            </p>
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

        {/* Tabs */}
        <div className="flex bg-slate-50 border-b border-slate-200 px-6 gap-2 pt-2">
          {[
            { id: 'application', label: '📁 Application Details' },
            { id: 'student', label: '👤 Student Details' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-t-xl text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#D99A1C] text-[#D99A1C] bg-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-[#D99A1C]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-bold text-slate-500">Loading data...</p>
            </div>
          ) : (
            <form id="edit-app-form" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl mb-4">
                  ⚠️ {error}
                </div>
              )}

              {/* ─── Tab 1: Application Details ─── */}
              {activeTab === 'application' && (
                <div className="space-y-4">

                  {/* University */}
                  <div>
                    <label className={labelClass}>Destination University *</label>
                    <div className="relative">
                      <select
                        value={selectedUniversity}
                        onChange={handleUniversityChange}
                        required
                        className={inputClass + ' appearance-none'}
                      >
                        <option value="" disabled>Select University</option>
                        {universities.map(uni => (
                          <option key={uni._id} value={uni._id}>{uni.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Course */}
                  <div>
                    <label className={labelClass}>Course Program *</label>
                    <div className="relative">
                      <select
                        value={selectedCourse}
                        onChange={e => setSelectedCourse(e.target.value)}
                        required
                        disabled={!selectedUniversity}
                        className={inputClass + ' appearance-none disabled:opacity-50'}
                      >
                        <option value="" disabled>
                          {selectedUniversity ? 'Select Course' : 'Select a university first'}
                        </option>
                        {filteredCourses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.title} ({course.degreeLevel || 'UG'})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {selectedUniversity && filteredCourses.length === 0 && (
                      <p className="text-[10px] text-amber-600 font-semibold mt-1">
                        ⚠️ No courses found for this university.
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className={labelClass}>Comments / Notes</label>
                    <textarea
                      rows="3"
                      className={inputClass + ' resize-none'}
                      placeholder="Add any comments or notes for this application..."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* ─── Tab 2: Student Details ─── */}
              {activeTab === 'student' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3 text-[10px] font-semibold text-amber-800">
                    ✏️ You are editing the student's personal profile. Changes will be saved to the student record and reflected across all applications.
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Riya Thomas"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={e => setStudentEmail(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. riya@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone & Passport */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={studentPhone}
                        onChange={e => setStudentPhone(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Passport Number</label>
                      <input
                        type="text"
                        value={studentPassport}
                        onChange={e => setStudentPassport(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. A1234567"
                      />
                    </div>
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Date of Birth</label>
                      <input
                        type="date"
                        value={studentDob}
                        onChange={e => setStudentDob(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Gender</label>
                      <div className="relative">
                        <select
                          value={studentGender}
                          onChange={e => setStudentGender(e.target.value)}
                          className={inputClass + ' appearance-none'}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass}>Resident Address</label>
                    <textarea
                      rows="2"
                      value={studentAddress}
                      onChange={e => setStudentAddress(e.target.value)}
                      className={inputClass + ' resize-none'}
                      placeholder="Full address including city, state and country..."
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Buttons */}
        {!isLoading && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-app-form"
              disabled={isSubmitting}
              className="bg-[#D99A1C] hover:bg-[#C28410] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save All Changes'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
