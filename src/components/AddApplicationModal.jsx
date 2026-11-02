import BatchDocumentUpload from './BatchDocumentUpload';
import DocumentNameSelect from './DocumentNameSelect';
import StudentDobInput from './StudentDobInput';
import { getStudentDobError } from '../utils/studentAge.mjs';
import SearchableSelect from './SearchableSelect';
import ValidatedInput from './ValidatedInput';
import { ActionButton, ActionForm } from './ActionControls';
import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function AddApplicationModal({ isOpen, onClose, onSubmit, closeRef }) {

  const [stepNumber, setStepNumber] = useState(1);
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Mode and form inputs for registering a new student
  const [studentSelectionMode, setStudentSelectionMode] = useState('new'); // 'existing' or 'new'
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentPassport, setNewStudentPassport] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('');
  const [newStudentGender, setNewStudentGender] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');

  const [hasQueuedDocuments, setHasQueuedDocuments] = useState(false);
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
  const [documentsList, setDocumentsList] = useState([
    { id: 1, name: '', fileName: '', url: '', isUploading: false, error: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Undergraduate (UG)');
  const [selectedIntake, setSelectedIntake] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError('');

      Promise.all([
        API.get('/students').then(res => res.data),
        API.get('/universities').then(res => res.data),
        API.get('/courses').then(res => res.data),
        API.get('/intakes').then(res => res.data)
      ])
      .then(([studentsRes, universitiesRes, coursesRes, intakesRes]) => {
        setStudents(studentsRes.data || []);
        setUniversities(universitiesRes.data || []);
        setCourses(coursesRes.data || []);
        setIntakes(intakesRes.data || []);
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

  const availableCountries = Array.from(
    new Set([
      ...universities.map(u => (u.country || '').trim()).filter(Boolean),

    ])
  ).sort();

  const filteredUniversities = universities.filter(univ => {
    if (!selectedCountry) return false;
    const uCountry = (univ.country || '').trim().toLowerCase();
    const sel = selectedCountry.trim().toLowerCase();
    return uCountry === sel ||
      (sel === 'united kingdom' && (uCountry === 'uk' || uCountry === 'england')) ||
      (sel === 'united states' && (uCountry === 'usa' || uCountry === 'us'));
  });

  const handleResetAndClose = () => {
    setSelectedStudent('');
    setSelectedCountry('');
    setSelectedUniversity('');
    setSelectedCourse('');
    setStudentSelectionMode('new');
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentPassport('');
    setNewStudentDob('');
    setNewStudentGender('');
    setNewStudentAddress('');
    setDocumentsList([
      { id: 1, name: '', fileName: '', url: '', isUploading: false, error: '' }
    ]);
    setNotes('');
    setSelectedLevel('Undergraduate (UG)');
    setSelectedIntake('');
    setStepNumber(1);
    onClose();
  };

  React.useImperativeHandle(closeRef, () => ({ close: handleResetAndClose }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasQueuedDocuments || isUploadingDocuments) { setError('Upload or remove queued documents before submitting.'); return; }
    const dobError = getStudentDobError(studentSelectionMode === 'new' ? newStudentDob : students.find(student => (student._id || student.id) === selectedStudent)?.dob);
    if (dobError) {
      setError(dobError);
      return;
    }
    if (studentSelectionMode === 'existing' && !selectedStudent) {
      setError('Please select a student.');
      return;
    }
    if (studentSelectionMode === 'new') {
      if (!newStudentName || !newStudentEmail || !newStudentPhone) {
        setError('Please fill in all required new student details (Name, Email, Phone).');
        return;
      }
    }
    if (!selectedCountry) {
      setError('Please select a destination country.');
      return;
    }
    if (!selectedUniversity || !selectedCourse) {
      setError('Please select a university and course.');
      return;
    }
    const validDocs = documentsList.filter(d => d.url);
    if (validDocs.length === 0) {
      setError('Please upload at least one document (e.g. Passport Bio-Page, Transcripts) to submit the application.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let studentId = selectedStudent;

      if (studentSelectionMode === 'new') {
        const studentRes = await API.post('/students', {
          name: newStudentName,
          email: newStudentEmail,
          phone: newStudentPhone,
          passportNo: newStudentPassport,
          dob: newStudentDob,
          gender: newStudentGender,
          address: newStudentAddress,
          referredBy: 'Agent'
        });
        const studentResult = studentRes.data;
        if (!studentResult?.success) {
          throw new Error(studentResult?.message || 'Failed to create new student profile.');
        }
        studentId = studentResult.data._id;
        setStudents(prev => [studentResult.data, ...prev]);
      }

      const finalDocuments = validDocs.map(d => ({
        name: d.name.trim() || d.fileName || 'Supporting Document',
        title: d.name.trim() || d.fileName || 'Supporting Document',
        fileName: d.fileName || (d.url ? d.url.split('/').pop().split('?')[0] : '') || d.name.trim(),
        url: d.url,
        comment: d.name.trim(),
        uploadedAt: new Date().toISOString()
      }));

      const success = await onSubmit({
        studentId: studentId,
        universityId: selectedUniversity,
        courseId: selectedCourse,
        level: selectedLevel || 'Undergraduate (UG)',
        intake: selectedIntake,
        documents: finalDocuments,
        notes: notes
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

  if (!isOpen) return null;

  return (
    <div
      className="w-full min-w-0 p-4 sm:p-6 lg:p-8 [overflow-wrap:anywhere]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 border-t-4 border-t-[#D99A1C] rounded-2xl w-full shadow-sm relative flex flex-col"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">Create application</h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">Add student information, choose a program, and upload supporting documents.</p>
          </div>
          <ActionButton
            onClick={handleResetAndClose}
            className="shrink-0 self-start inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </ActionButton>
        </div>

        {/* Application form content */}
        <div className="p-4 sm:p-6 flex-1">
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
            <ActionForm onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">New Application Details</h3>
                <p className="text-[11px] text-[#64748B] font-semibold">Select the student profile, target university, and program course.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
                {/* Student Dropdown / Register Switcher */}
                <section className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
                  <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider mb-2">Student Information</label>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
                      <input
                        type="radio"
                        name="studentSelectionMode"
                        checked={studentSelectionMode === 'existing'}
                        onChange={() => setStudentSelectionMode('existing')}
                        className="text-[#D99A1C] focus:ring-[#D99A1C]"
                      />
                      Existing Student
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0F172A]">
                      <input
                        type="radio"
                        name="studentSelectionMode"
                        checked={studentSelectionMode === 'new'}
                        onChange={() => setStudentSelectionMode('new')}
                        className="text-[#D99A1C] focus:ring-[#D99A1C]"
                      />
                      Register New Student
                    </label>
                  </div>

                  {studentSelectionMode === 'existing' ? (
                    <div>
                      <div className="relative">
                        <SearchableSelect
                          required={studentSelectionMode === 'existing'}
                          value={selectedStudent}
                          onChange={(e) => setSelectedStudent(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                        >
                          <option value="">
                            {students.length === 0 ? '-- No Registered Students Found --' : '-- Choose Student --'}
                          </option>
                          {students.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.name} ({student.passportNo || 'No Passport'})
                            </option>
                          ))}
                        </SearchableSelect>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                          <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {students.length === 0 && (
                        <p className="text-[10px] text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
                          <span>💡</span> You haven't registered any students yet.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 shadow-inner">
                      <div>
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Student Full Name *</label>
                        <input
                          type="text"
                          required={studentSelectionMode === 'new'}
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Email Address *</label>
                          <input
                            type="email"
                            required={studentSelectionMode === 'new'}
                            value={newStudentEmail}
                            onChange={(e) => setNewStudentEmail(e.target.value)}
                            placeholder="john@gmail.com"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Passport Number *</label>
                          <ValidatedInput validationKind="passport"
                            type="text"
                            required={studentSelectionMode === 'new'}
                            value={newStudentPassport}
                            onChange={(e) => setNewStudentPassport(e.target.value)}
                            placeholder="e.g. A1234567"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Phone Number</label>
                          <ValidatedInput validationKind="phone"
                            type="text"
                            value={newStudentPhone}
                            onChange={(e) => setNewStudentPhone(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Date of Birth</label>
                          <StudentDobInput
                            value={newStudentDob}
                            onChange={(e) => setNewStudentDob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Gender</label>
                          <SearchableSelect
                            value={newStudentGender}
                            onChange={(e) => setNewStudentGender(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A] cursor-pointer"
                          >
                            <option value="">-- Select Gender --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </SearchableSelect>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Resident Address</label>
                          <input
                            type="text"
                            value={newStudentAddress}
                            onChange={(e) => setNewStudentAddress(e.target.value)}
                            placeholder="Address, City, State"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Program & intake</h3>
                {/* Destination Country Dropdown */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Destination Country *
                  </label>
                  <div className="relative">
                    <SearchableSelect
                      required
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedUniversity('');
                        setSelectedCourse('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A]"
                    >
                      <option value="">-- Choose Country First --</option>
                      {availableCountries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </SearchableSelect>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* University Dropdown (filtered by selected country) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      Select University *
                    </label>
                    {selectedCountry && (
                      <span className="text-[10px] font-bold text-[#D99A1C]">
                        {filteredUniversities.length} institution{filteredUniversities.length !== 1 ? 's' : ''} in {selectedCountry}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <SearchableSelect searchLabel="Search universities..."
                      required
                      disabled={!selectedCountry}
                      value={selectedUniversity}
                      onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                        setSelectedCourse(''); // Reset course
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedCountry 
                          ? '-- Select Country First --' 
                          : filteredUniversities.length === 0 
                            ? `-- No Universities in ${selectedCountry} --` 
                            : '-- Choose University --'}
                      </option>
                      {filteredUniversities.map((univ) => (
                        <option key={univ._id} value={univ._id}>
                          {univ.name} ({univ.city ? `${univ.city}, ` : ''}{univ.country})
                        </option>
                      ))}
                    </SearchableSelect>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedCountry && filteredUniversities.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      ⚠️ No institutions found for {selectedCountry}. Please select another country.
                    </p>
                  )}
                </div>

                {/* Course Dropdown */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">Select Course</label>
                  <div className="relative">
                    <SearchableSelect searchLabel="Search courses..."
                      required
                      disabled={!selectedUniversity}
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white cursor-pointer appearance-none pr-8 font-semibold text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!selectedUniversity ? '-- Please Select a University First --' : '-- Choose Course --'}
                      </option>
                      {filteredCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title} ({course.degreeLevel || 'N/A'})
                        </option>
                      ))}
                    </SearchableSelect>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedUniversity && filteredCourses.length === 0 && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1">âš ï¸ No courses registered under this university in the database.</p>
                  )}
                </div>

                {/* Level of Study */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Level of Study *
                  </label>
                  <div className="relative">
                    <SearchableSelect
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white font-semibold text-[#0F172A] appearance-none cursor-pointer"
                    >
                      <option value="Undergraduate (UG)">Undergraduate (UG)</option>
                      <option value="Postgraduate (PG)">Postgraduate (PG)</option>
                      <option value="PhD">PhD</option>
                    </SearchableSelect>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Requested Intake Season */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Requested Intake Season *
                  </label>
                  <div className="relative">
                    <SearchableSelect
                      value={selectedIntake}
                      onChange={(e) => setSelectedIntake(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white font-semibold text-[#0F172A] appearance-none"
                    >
                      <option value="">Select intake</option>
                      {intakes.map(i => <option key={i._id} value={i.title}>{i.title}</option>)}
                    </SearchableSelect>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                      <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                </section>
              </div>

              <div className="space-y-3 text-left rounded-xl border border-slate-200 p-4 sm:p-5">
                <h3 className="text-xs font-bold text-slate-700">Supporting Documents *</h3>
                <BatchDocumentUpload role="Student" disabled={isSubmitting} onBusyChange={setIsUploadingDocuments} onPendingChange={setHasQueuedDocuments} onComplete={async uploaded => { setDocumentsList(prev => [...prev.filter(doc => doc.url), ...uploaded.map(doc => ({ ...doc, id: crypto.randomUUID(), isUploading: false, error: '' }))]); }} />
                {documentsList.filter(doc => doc.url).map(doc => <div key={doc.id} className="rounded-xl border border-slate-200 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs"><span className="break-all">{doc.fileName}</span><ActionButton type="button" disabled={isSubmitting} className="font-bold text-red-700" onClick={() => setDocumentsList(prev => prev.filter(item => item.id !== doc.id))}>Remove</ActionButton></div>
                  <DocumentNameSelect role="Student" multiple={false} value={doc.name} disabled={isSubmitting} onChange={name => setDocumentsList(prev => prev.map(item => item.id === doc.id ? { ...item, name: name || item.fileName, title: name || item.fileName } : item))} />
                </div>)}
              </div>

              {/* Application-Level General Comment */}
              <div className="space-y-1.5 mt-4 text-left">
                <label className="block text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                  💬 COMMENTS
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#D99A1C] focus:bg-white font-semibold text-[#0F172A] resize-none"
                  placeholder="Add comments or notes for this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <ActionButton
                type="submit"
                disabled={
                  isSubmitting ||
                  documentsList.some(d => d.isUploading) || hasQueuedDocuments || isUploadingDocuments ||
                  !documentsList.some(d => d.url) ||
                  (studentSelectionMode === 'existing' && !selectedStudent) ||
                  (studentSelectionMode === 'new' && (!newStudentName || !newStudentEmail || !newStudentPhone)) ||
                  !selectedUniversity ||
                  !selectedCourse
                }
                className="w-full sm:w-auto sm:ml-auto bg-[#D99A1C] hover:bg-[#C28410] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors mt-6 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
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
              </ActionButton>
            </ActionForm>
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
              <h3 className="text-base font-bold text-[#10B981] mt-2 flex items-center justify-center gap-1.5">
                <span>🎉</span> Application Submitted!
              </h3>
              <p className="text-xs text-[#64748B] font-semibold max-w-xs leading-relaxed">
                Your application has been logged in the Unigather system. Our handlers will verify the information.
              </p>
              <ActionButton
                type="button"
                onClick={handleResetAndClose}
                className="bg-[#D99A1C] hover:bg-[#C28410] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all duration-150 shadow-md uppercase tracking-wider mt-4"
              >
                Close
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
