import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import SearchableSelect from '../components/SearchableSelect';
import { getDisplayId } from '../utils/displayId';
import { ActionButton } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { mapCourse } from '../utils/resourceData';

export default function SearchCourses({ onApplyCourse }) {
  const toast = useToast();
  const list = useServerList('/courses');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  const { records: courseRecords, loading, error } = list;
  const allCourses = courseRecords.map(mapCourse);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      list.setFilter('degreeLevel', undefined);
    } else {
      list.setFilter('degreeLevel', tab);
    }
    list.setPage(1);
  };

  const handleApply = (course) => {
    if (onApplyCourse) {
      onApplyCourse(course);
    } else {
      toast.info(`Initiating student application file for ${course.title} at ${course.university}.`);
    }
  };

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {/* Title */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Search Courses</h1>
          <p className="text-xs text-slate-500 font-medium">Explore and filter through our active list of courses across international universities.</p>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading courses...</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/courses" field="degreeLevel" options={[{value:'All',label:'All'},...(list.facets.degreeLevel || []).map(value=>({value,label:value}))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="courses"
          fields={[
            { key: 'country', label: 'Countries' },
            { key: 'university', label: 'Universities' },
            { key: 'degreeLevel', label: 'Levels' }
          ]}
        />

        

        <div className="overflow-x-auto">
          {allCourses.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Course Title</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">University & Country</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Duration / Intake</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Est. Fee</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {allCourses.map((course) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={course.id}
                    onClick={() => setSelectedCourseDetails(course)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{course.title}</p>
                      <p className="text-[10px] font-mono text-slate-400">{getDisplayId(course)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{course.university}</p>
                      <p className="text-[10px] text-slate-400">{course.country || 'International'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border bg-blue-50 text-blue-700 border-blue-200">
                        {course.degreeLevel || course.level || 'Degree'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-bold block">{course.duration}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block">{course.intake || 'All Seasons'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-700 text-xs">
                      {course.fee}
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Course Specs',
                            onClick: () => setSelectedCourseDetails(course)
                          },
                          {
                            label: 'Apply for Course',
                            onClick: () => handleApply(course)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              No courses found matching your criteria.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>

      {selectedCourseDetails && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-label="Course specifications" className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h2 className="font-bold text-slate-900 text-base">{selectedCourseDetails.title}</h2>
            <p className="text-xs font-mono text-slate-500">{getDisplayId(selectedCourseDetails)}</p>
            <p className="text-sm text-slate-700 font-semibold">{selectedCourseDetails.university}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedCourseDetails.description || 'No course description provided.'}</p>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Duration</span>
                <span className="font-bold text-slate-800">{selectedCourseDetails.duration || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Fees</span>
                <span className="font-bold text-emerald-700">{selectedCourseDetails.fee}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Intakes</span>
                <span className="font-bold text-slate-800">{selectedCourseDetails.intake || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black block">Level</span>
                <span className="font-bold text-slate-800">{selectedCourseDetails.degreeLevel || selectedCourseDetails.level || 'Degree'}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <ActionButton onClick={() => setSelectedCourseDetails(null)} className="border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-xs font-bold hover:bg-slate-50">Close</ActionButton>
              <ActionButton onClick={() => { setSelectedCourseDetails(null); handleApply(selectedCourseDetails); }} className="bg-[#D99A1C] hover:bg-[#F5B025] text-white rounded-xl px-5 py-2 text-xs font-bold">Apply Now</ActionButton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
