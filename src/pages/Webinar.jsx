import DocumentPreview from '../components/DocumentPreview';
import ListFilterTabs from '../components/ListFilterTabs';
import useServerList from '../hooks/useServerList';
import ListToolbar, { ListPagination } from '../components/ListToolbar';
import ActionMenu from '../components/ActionMenu';
import SearchableSelect from '../components/SearchableSelect';
import { ActionButton, ActionForm } from '../components/ActionControls';
import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import useApiCollection from '../hooks/useApiCollection';

export default function Webinar() {
  const toast = useToast();
  const list = useServerList('/webinars');
  const { records: universityRecords } = useApiCollection('/universities');
  const UNIVERSITIES_LIST = universityRecords.map(u => u.name);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [webinars, setWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWebinarForDetails, setSelectedWebinarForDetails] = useState(null);

  // Helper to map backend object to frontend object
  const mapBackendToFrontend = (w) => {
    let poster = w.poster || '';
    let description = w.description || '';
    if (description.startsWith('POSTER_URL:')) {
      const parts = description.split('|||');
      poster = parts[0].substring('POSTER_URL:'.length);
      description = parts.slice(1).join('|||');
    }
    return {
      id: w._id || w.id,
      title: w.title,
      university: w.speaker || 'Unknown University',
      date: w.date || '',
      description: description,
      youtubeUrl: w.link || '',
      status: w.status === 'Completed' ? 'Recorded' : (w.status || 'Upcoming'),
      poster: poster
    };
  };

  useEffect(() => {
    let isMounted = true;
    const fetchWebinars = async () => {
      try {
        const res = await API.get('/webinars');
        if (res.data && res.data.success && isMounted) {
          setWebinars(res.data.data.map(mapBackendToFrontend));
        }
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Unable to load webinars.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWebinars();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (status) => {
    setActiveTab(status);
    if (status === 'All') {
      list.setFilter('status', undefined);
    } else {
      list.setFilter('status', status === 'Recorded' ? 'Completed' : status);
    }
    list.setPage(1);
  };

  // Upload Form Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formUni, setFormUni] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formYoutube, setFormYoutube] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store poster in S3 before attaching it to the form.
  const processFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploadingPoster(true);
      setPosterFile(file);
      setFileName(file.name);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('documentName', 'Webinar Poster');
        uploadFormData.append('folder', 'webinar-posters');
        const uploadRes = await API.post('/upload', uploadFormData);
        if (uploadRes.data && uploadRes.data.url) {
          setFormPosterUrl(uploadRes.data.url);
          toast.success('Poster uploaded successfully!');
        } else {
          throw new Error('Upload succeeded without file url');
        }
      } catch (uploadErr) {
        toast.error(uploadErr.response?.data?.message || 'Failed to upload poster file. Please try again.');
        setFileName(''); setPosterFile(null);
      } finally {
        setIsUploadingPoster(false);
      }
    } else {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formUni || !formDate) {
      toast.error('Please fill in required fields (Title, Host/Speaker, and Date)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle,
        speaker: formUni,
        date: formDate,
        description: formPosterUrl ? `POSTER_URL:${formPosterUrl}|||${formDescription}` : formDescription,
        link: formYoutube || '',
        platform: 'Online / Zoom / YouTube',
        status: 'Upcoming'
      };

      const res = await API.post('/webinars', payload);
      if (res.data && res.data.success) {
        const newWebinar = mapBackendToFrontend(res.data.data);
        setWebinars(prev => [newWebinar, ...prev]);
        list.refresh();
        setFormTitle('');
        setFormUni('');
        setFormDate('');
        setFormDescription('');
        setFormYoutube('');
        setFormPosterUrl('');
        setFileName(''); setPosterFile(null);
        setShowUploadModal(false);
        toast.success('Webinar hosted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to host webinar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWebinars = list.records.map(mapBackendToFrontend);

  const formatDateString = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const upcomingCount = webinars.filter(w => w.status === 'Upcoming').length;
  const liveCount = webinars.filter(w => w.status === 'Live').length;
  const recordedCount = webinars.filter(w => w.status === 'Recorded' || w.status === 'Completed').length;

  return (
    <div className="workspace-page flex-1 p-4 sm:p-6 space-y-6 bg-[#F0F2F5] animate-fade-in-up">
      {loadError && <p role="alert" className="text-sm text-red-600">{loadError}</p>}

      {/* Page Header */}
      <div className="workspace-panel flex flex-wrap gap-3 justify-between items-center bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">University Webinar Hub</h1>
          <p className="text-xs text-slate-500 font-medium">Access upcoming live university seminars, recorded webinars and interactive playback streams.</p>
        </div>
        <ActionButton
          onClick={() => setShowUploadModal(true)}
          className="bg-[#D99A1C] hover:bg-[#F5B025] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Host Webinar / Upload Poster</span>
        </ActionButton>
      </div>

      {/* Table Frame */}
      <div className="workspace-panel workspace-list-frame bg-white border border-[#E2E8F0] border-t-4 border-t-[#D99A1C] rounded-2xl shadow-xs overflow-hidden">
        {/* Scoping Tabs */}
        <ListFilterTabs list={list} endpoint="/webinars" field="status" options={[{value:'All',label:'All'},...(list.facets.status || []).map(value=>({value,label:value}))]} />

        {/* ListToolbar */}
        <ListToolbar
          list={list}
          label="webinars"
          fields={[
            { key: 'speaker', label: 'Universities' },
            { key: 'status', label: 'Statuses' }
          ]}
        />

        

        <div className="overflow-x-auto">
          {filteredWebinars.length > 0 ? (
            <table className="workspace-table w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Webinar Title</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Host / University</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Schedule Time</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredWebinars.map((webinar) => (
                  <tr tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); event.currentTarget.click(); } }}
                    key={webinar.id}
                    onClick={() => setSelectedWebinarForDetails(webinar)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {webinar.poster ? (
                          <img src={webinar.poster} alt={webinar.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#D99A1C] border border-amber-200 flex items-center justify-center font-bold text-sm shrink-0">
                            🎥
                          </div>
                        )}
                        <div>
                          <p className="font-black text-slate-900 text-xs group-hover:text-[#D99A1C] transition-colors">{webinar.title}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{webinar.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{webinar.university}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                      {formatDateString(webinar.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        webinar.status === 'Live'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : webinar.status === 'Upcoming'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {webinar.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            label: 'View Webinar Details',
                            onClick: () => setSelectedWebinarForDetails(webinar)
                          },
                          ...(webinar.youtubeUrl ? [
                            {
                              label: 'Join / Watch Stream',
                              onClick: () => window.open(webinar.youtubeUrl, '_blank')
                            }
                          ] : [])
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 font-semibold">
              No webinars found matching your criteria.
            </div>
          )}
        </div>

        <ListPagination list={list} />
      </div>

      {/* Selected Webinar Details Modal */}
      {selectedWebinarForDetails && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            {selectedWebinarForDetails.poster && (
              <img src={selectedWebinarForDetails.poster} alt={selectedWebinarForDetails.title} className="w-full h-48 object-cover rounded-xl" />
            )}
            <h2 className="font-black text-slate-900 text-base">{selectedWebinarForDetails.title}</h2>
            <p className="text-xs font-bold text-[#D99A1C] uppercase">{selectedWebinarForDetails.university}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedWebinarForDetails.description}</p>
            <p className="text-xs text-slate-500 font-mono">📅 {formatDateString(selectedWebinarForDetails.date)}</p>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <ActionButton onClick={() => setSelectedWebinarForDetails(null)} className="border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-xs font-bold hover:bg-slate-50">Close</ActionButton>
              {selectedWebinarForDetails.youtubeUrl && (
                <ActionButton onClick={() => window.open(selectedWebinarForDetails.youtubeUrl, '_blank')} className="bg-[#D99A1C] hover:bg-[#F5B025] text-white rounded-xl px-5 py-2 text-xs font-bold">Watch Stream</ActionButton>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Webinar Modal */}
      {showUploadModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto">
            <div className="flex justify-between items-center p-4 bg-[#0F172A] text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider">Host New University Webinar</h3>
              <ActionButton onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</ActionButton>
            </div>
            <ActionForm onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Webinar Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                  placeholder="e.g. Master of Data Science Virtual Open Day"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Speaker / University *</label>
                <input
                  type="text"
                  required
                  value={formUni}
                  onChange={(e) => setFormUni(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                  placeholder="e.g. University of Manchester Admissions"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Stream / Meeting URL</label>
                <input
                  type="url"
                  value={formYoutube}
                  onChange={(e) => setFormYoutube(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                  placeholder="https://zoom.us/j/... or YouTube URL"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#D99A1C]"
                  placeholder="Agenda, prerequisites, scholarship perks discussed..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Poster Image</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    dragOver ? 'border-[#D99A1C] bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => document.getElementById('webinar-poster-input')?.click()}
                >
                  <input
                    id="webinar-poster-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <DocumentPreview file={posterFile} />
                  {isUploadingPoster ? (
                    <p className="text-xs text-amber-600 font-bold">Uploading poster...</p>
                  ) : fileName ? (
                    <p className="text-xs text-emerald-600 font-bold">✓ {fileName}</p>
                  ) : (
                    <p className="text-xs text-slate-400">Click or drag & drop poster image here</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <ActionButton
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#D99A1C] hover:bg-[#F5B025] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                >
                  {isSubmitting ? 'Hosting...' : 'Host Webinar'}
                </ActionButton>
              </div>
            </ActionForm>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
