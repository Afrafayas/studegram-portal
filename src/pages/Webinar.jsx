import React, { useState, useEffect } from 'react';

// Pre-populated Mock Data
const INITIAL_WEBINARS = [
  {
    id: 'webinar-1',
    title: 'Preparing for CAS Interviews & Visa Guidance',
    university: 'Coventry University',
    date: '2026-07-18T16:00',
    description: 'Learn what to expect during Coventry University\'s CAS verification process and get answers live from admissions coordinators. Learn about documents required, financial verification, and interview questions.',
    youtubeUrl: 'https://www.youtube.com/watch?v=71Y8QnykFi4',
    status: 'Upcoming',
    poster: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'webinar-2',
    title: 'STEM Careers & Post-Study Work Opportunities in the UK',
    university: 'University of Surrey',
    date: '2026-07-22T14:30',
    description: 'Join Surrey representatives and industry professionals as they discuss UK student visa pathways, Graduate Route (PSW) rules, and high-demand careers in STEM fields.',
    youtubeUrl: 'https://www.youtube.com/watch?v=SwCf8B07_s8',
    status: 'Upcoming',
    poster: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'webinar-3',
    title: 'Anglia Ruskin University: Scholarship & IELTS Waiver Guide',
    university: 'Anglia Ruskin University',
    date: '2026-07-10T11:00',
    description: 'An in-depth look at ARU\'s scholarship options for global intakes, including application walkthroughs, entry requirements, and the new CBSE/ICSE English waiver policies.',
    youtubeUrl: 'https://www.youtube.com/watch?v=HKwmD9yFBx8',
    status: 'Recorded',
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'webinar-4',
    title: 'University of Hertfordshire: Campus Life & Engineering Tour',
    university: 'University of Hertfordshire',
    date: '2026-07-28T10:00',
    description: 'Discover campus life, housing options, and virtual tours of the advanced aerospace, robotics, and automotive labs at Hertfordshire.',
    youtubeUrl: 'https://www.youtube.com/watch?v=PwBtjFEv8UU',
    status: 'Upcoming',
    poster: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_INFORMATIVES = [
  {
    id: 'info-1',
    type: 'PDF',
    title: 'Undergraduate Prospectus 2026/27',
    university: 'University of Surrey',
    description: 'Complete list of undergraduate courses, entry conditions, campus life overview, and student facilities guides.',
    fileUrl: 'https://www.studyin-uk.in/profiles/university/surrey/SurreyUGProspectus.pdf',
    fileSize: '4.8 MB'
  },
  {
    id: 'info-2',
    type: 'PDF',
    title: 'Anglia Ruskin Waiver & Scholarship Criteria Sheet',
    university: 'Anglia Ruskin University',
    description: 'Official PDF sheet highlighting high school academic waiver rules, IELTS replacement options, and discount amounts.',
    fileUrl: 'https://www.aru.ac.uk/-/media/files/international/scholarship-brochure.pdf',
    fileSize: '1.2 MB'
  },
  {
    id: 'info-3',
    type: 'Video',
    title: 'Coventry University Virtual Campus Tour',
    university: 'Coventry University',
    description: 'Watch a comprehensive virtual video tour of the main campus, showing library interior spaces, interactive lobbies, and research labs.',
    fileUrl: 'https://www.youtube.com/embed/71Y8QnykFi4',
    duration: '5:42'
  },
  {
    id: 'info-4',
    type: 'Video',
    title: 'Science and Technology Labs Walkthrough',
    university: 'University of Hertfordshire',
    description: 'A detailed tour showcasing Hertfordshire\'s state-of-the-art simulation labs, wind tunnel, and computer science study zones.',
    fileUrl: 'https://www.youtube.com/embed/PwBtjFEv8UU',
    duration: '4:12'
  },
  {
    id: 'info-5',
    type: 'Image',
    title: 'Manor Park Student Village & Accommodations',
    university: 'University of Surrey',
    description: 'High-definition photo of Surrey\'s popular student residential block featuring modern ensuite apartments and green parks.',
    fileUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'info-6',
    type: 'Image',
    title: 'Lanchester Library Architectural Highlight',
    university: 'Coventry University',
    description: 'Scenic interior snapshot of Coventry\'s award-winning library showing multiple study levels and modern aesthetic spaces.',
    fileUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80'
  }
];

const UNIVERSITIES_LIST = [
  'Anglia Ruskin University',
  'University of Surrey',
  'Coventry University',
  'University of Hertfordshire',
  'University of Toronto',
  'McGill University',
  'University of British Columbia',
  'New York University'
];

export default function Webinar() {
  const [activeTab, setActiveTab] = useState('webinars'); // 'webinars' | 'informatives'
  const [webinars, setWebinars] = useState(() => {
    const saved = localStorage.getItem('studegram_webinars');
    if (saved) {
      const list = JSON.parse(saved);
      let updatedList = list.map((webinar) => {
        if (webinar.id === 'webinar-1' && webinar.youtubeUrl.includes('dQw4w9WgXcQ')) {
          return { ...webinar, youtubeUrl: 'https://www.youtube.com/watch?v=71Y8QnykFi4' };
        }
        if (webinar.id === 'webinar-2' && webinar.youtubeUrl.includes('dQw4w9WgXcQ')) {
          return { ...webinar, youtubeUrl: 'https://www.youtube.com/watch?v=SwCf8B07_s8' };
        }
        if (webinar.id === 'webinar-3' && webinar.youtubeUrl.includes('dQw4w9WgXcQ')) {
          return { ...webinar, youtubeUrl: 'https://www.youtube.com/watch?v=HKwmD9yFBx8' };
        }
        return webinar;
      });

      // Ensure Hertfordshire is appended to existing localStorage list if missing
      const hasHerts = updatedList.some((w) => w.id === 'webinar-4');
      if (!hasHerts) {
        updatedList.push({
          id: 'webinar-4',
          title: 'University of Hertfordshire: Campus Life & Engineering Tour',
          university: 'University of Hertfordshire',
          date: '2026-07-28T10:00',
          description: 'Discover campus life, housing options, and virtual tours of the advanced aerospace, robotics, and automotive labs at Hertfordshire.',
          youtubeUrl: 'https://www.youtube.com/watch?v=PwBtjFEv8UU',
          status: 'Upcoming',
          poster: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
        });
      }
      return updatedList;
    }
    return INITIAL_WEBINARS;
  });
  const [informatives, setInformatives] = useState(INITIAL_INFORMATIVES);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [uniFilter, setUniFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // For informatives (PDF, Video, Image)

  // Upload Form Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formUni, setFormUni] = useState(UNIVERSITIES_LIST[0]);
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formYoutube, setFormYoutube] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  // Media Modals
  const [viewingImage, setViewingImage] = useState(null);
  const [viewingVideo, setViewingVideo] = useState(null);

  // Sync webinars to localStorage
  useEffect(() => {
    localStorage.setItem('studegram_webinars', JSON.stringify(webinars));
  }, [webinars]);

  // Handle Poster File Upload & Convert to Base64
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormPosterUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (PNG/JPG).');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // Submit Poster / Webinar Form
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate || !formDescription.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    // Default placeholder poster if not uploaded
    const posterSrc = formPosterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
    
    // Validate YouTube URL
    let videoUrl = formYoutube.trim();
    if (videoUrl && !videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      videoUrl = 'https://' + videoUrl;
    }

    const newWebinar = {
      id: `webinar-${Date.now()}`,
      title: formTitle,
      university: formUni,
      date: formDate,
      description: formDescription,
      youtubeUrl: videoUrl || 'https://www.youtube.com',
      status: new Date(formDate) > new Date() ? 'Upcoming' : 'Recorded',
      poster: posterSrc
    };

    setWebinars([newWebinar, ...webinars]);
    
    // Reset Form & Close Modal
    setFormTitle('');
    setFormUni(UNIVERSITIES_LIST[0]);
    setFormDate('');
    setFormDescription('');
    setFormYoutube('');
    setFormPosterUrl('');
    setFileName('');
    setShowUploadModal(false);
  };

  // Filter Logic
  const filteredWebinars = webinars.filter((webinar) => {
    const matchesUni = uniFilter === 'All' || webinar.university === uniFilter;
    const matchesSearch = webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          webinar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          webinar.university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUni && matchesSearch;
  });

  const filteredInformatives = informatives.filter((info) => {
    const matchesUni = uniFilter === 'All' || info.university === uniFilter;
    const matchesType = typeFilter === 'All' || info.type === typeFilter;
    const matchesSearch = info.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          info.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          info.university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUni && matchesType && matchesSearch;
  });

  // Format Date for view
  const formatDateString = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-8 bg-[#F0F2F5] animate-fade-in-up">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">University Webinar Hub</h1>
          <p className="text-xs text-[#64748B] font-semibold mt-1">
            Access live university seminars, download static booklets, watch campus tour playbacks, and schedule broadcasts.
          </p>
        </div>

        {/* Action Button */}
        {activeTab === 'webinars' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="self-start md:self-auto bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Host Webinar / Upload Poster
          </button>
        )}
      </div>

      {/* Tabs Menu & Search/Filter Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Tab Selector */}
        <div className="flex border-b border-[#E2E8F0]">
          <button
            onClick={() => { setActiveTab('webinars'); setSearchQuery(''); }}
            className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 px-4 transition-all duration-150 ${
              activeTab === 'webinars'
                ? 'border-[#D99A1C] text-[#0F172A]'
                : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            🎥 Webinars & YouTube Streams
          </button>
          <button
            onClick={() => { setActiveTab('informatives'); setSearchQuery(''); }}
            className={`pb-3 text-xs font-extrabold tracking-wider uppercase border-b-2 px-4 transition-all duration-150 ${
              activeTab === 'informatives'
                ? 'border-[#D99A1C] text-[#0F172A]'
                : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            📂 University Static Informatives
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <input
                type="text"
                placeholder={activeTab === 'webinars' ? "Search webinars..." : "Search booklets, tours..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#D99A1C] font-semibold"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* University Selector Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={uniFilter}
                onChange={(e) => setUniFilter(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none"
              >
                <option value="All">All Universities</option>
                {UNIVERSITIES_LIST.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Type Selector (Only for Informatives Tab) */}
            {activeTab === 'informatives' && (
              <div className="relative w-full sm:w-40">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none"
                >
                  <option value="All">All Formats</option>
                  <option value="PDF">PDF Books</option>
                  <option value="Video">Video Tours</option>
                  <option value="Image">Campus Photos</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Counts */}
          <div className="text-[11px] font-bold text-[#64748B] self-end sm:self-center">
            {activeTab === 'webinars'
              ? `Found ${filteredWebinars.length} webinars`
              : `Found ${filteredInformatives.length} static resources`
            }
          </div>
        </div>
      </div>

      {/* Tabs View Containers */}
      {activeTab === 'webinars' ? (
        /* Webinars Cards Grid */
        filteredWebinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredWebinars.map((webinar) => (
              <div
                key={webinar.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all duration-200"
              >
                {/* Poster Display */}
                <div className="h-48 relative overflow-hidden bg-slate-100 group border-b border-slate-100">
                  <img
                    src={webinar.poster}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs border ${
                      webinar.status === 'Upcoming'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {webinar.status}
                    </span>
                  </div>
                </div>

                {/* Card Content details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold text-[#D99A1C] uppercase tracking-wider">
                      {webinar.university}
                    </div>
                    <h3 className="font-extrabold text-sm text-[#0F172A] leading-snug truncate-2-lines min-h-[40px]">
                      {webinar.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed font-semibold line-clamp-3">
                      {webinar.description}
                    </p>
                  </div>

                  {/* Footer & CTA */}
                  <div className="border-t border-slate-50 pt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#475569] font-bold">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#D99A1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateString(webinar.date)}</span>
                      </div>
                    </div>

                    <a
                      href={webinar.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-150 shadow-xs hover:scale-[1.01] active:scale-95 text-center"
                    >
                      <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Webinars State */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-[#64748B] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0F172A]">No Webinars Found</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                Try modifying your keyword search or university filter choices to see match options.
              </p>
            </div>
            <button
              onClick={() => { setUniFilter('All'); setSearchQuery(''); }}
              className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : (
        /* Informatives Cards Grid */
        filteredInformatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredInformatives.map((info) => (
              <div
                key={info.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Format Tag Header */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider ${
                      info.type === 'PDF' ? 'bg-red-50 text-red-700 border-red-100' :
                      info.type === 'Video' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {info.type}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-bold">
                      {info.type === 'PDF' && info.fileSize}
                      {info.type === 'Video' && `Play time: ${info.duration}`}
                      {info.type === 'Image' && 'Photo'}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-extrabold text-[#D99A1C] uppercase tracking-wider">
                      {info.university}
                    </div>
                    <h3 className="font-extrabold text-sm text-[#0F172A] leading-snug">
                      {info.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-semibold leading-relaxed line-clamp-3">
                      {info.description}
                    </p>
                  </div>
                </div>

                {/* Media Specific CTA Actions */}
                <div className="pt-5 border-t border-slate-50 mt-4">
                  {info.type === 'PDF' && (
                    <a
                      href={info.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-xs text-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Open & Download Prospectus PDF
                    </a>
                  )}

                  {info.type === 'Video' && (
                    <button
                      onClick={() => setViewingVideo(info)}
                      className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
                        <path d="M4 4l12 6-12 6V4z" />
                      </svg>
                      Watch Campus Video Tour
                    </button>
                  )}

                  {info.type === 'Image' && (
                    <button
                      onClick={() => setViewingImage(info)}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Zoom Image Gallery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Informatives State */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-[#64748B] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0F172A]">No Static Resources</h3>
              <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                No flyers, PDFs or media guides matched your search description parameters.
              </p>
            </div>
            <button
              onClick={() => { setUniFilter('All'); setTypeFilter('All'); setSearchQuery(''); }}
              className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-150"
            >
              Reset Filters
            </button>
          </div>
        )
      )}

      {/* Host Webinar / Upload Poster Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between text-left">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider">Host Webinar & Upload Poster</h2>
                <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Fill details and attach a seminar display graphic poster.</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto text-left">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Webinar Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master's Pre-departure Briefing"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                  />
                </div>

                {/* University Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">University Partner</label>
                  <div className="relative">
                    <select
                      value={formUni}
                      onChange={(e) => setFormUni(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#D99A1C] appearance-none"
                    >
                      {UNIVERSITIES_LIST.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#475569]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Broadcast Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                  />
                </div>

                {/* YouTube Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">YouTube / Stream URL</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formYoutube}
                    onChange={(e) => setFormYoutube(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Description Summary *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Outline topics covered, target students, key benefits of attending..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                ></textarea>
              </div>

              {/* Drag and Drop File Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-wider">Webinar Poster Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    dragOver ? 'border-[#D99A1C] bg-[#D99A1C]/5' : 'border-slate-300 bg-[#F8FAFC] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer space-y-2 w-full text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shadow-inner text-slate-500 mx-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">
                        {fileName ? `File Selected: ${fileName}` : 'Click to Upload or Drag Poster here'}
                      </p>
                      <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Supports PNG, JPG, JPEG (will be compressed locally)</p>
                    </div>
                  </label>
                </div>

                {/* Image Upload Preview */}
                {formPosterUrl && (
                  <div className="pt-2">
                    <p className="text-[9px] font-extrabold text-[#475569] uppercase tracking-wider mb-1">Poster Preview:</p>
                    <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={formPosterUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#475569] py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01]"
                >
                  Publish Webinar Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      {viewingImage && (
        <div className="fixed top-[60px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
          <div className="relative max-w-4xl w-full bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-100px)]">
            
            {/* Close Button */}
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all shadow-md z-20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 flex flex-col items-center">
              {/* Content Display */}
              <div className="w-full max-h-[60vh] md:max-h-[50vh] bg-slate-955 flex items-center justify-center">
                <img src={viewingImage.fileUrl} alt={viewingImage.title} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Description block */}
              <div className="w-full p-6 text-left text-white space-y-2">
                <span className="text-[10px] text-[#D99A1C] font-extrabold uppercase tracking-wider">{viewingImage.university}</span>
                <h3 className="text-sm font-extrabold">{viewingImage.title}</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{viewingImage.description}</p>
                
                <div className="pt-2 flex justify-end">
                  <a
                    href={viewingImage.fileUrl}
                    download={viewingImage.title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#D99A1C] hover:bg-[#C28410] text-black text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download HD Image
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Playback Modal */}
      {viewingVideo && (
        <div className="fixed top-[60px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
          <div className="relative max-w-4xl w-full bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-100px)]">
            
            {/* Close Button */}
            <button
              onClick={() => setViewingVideo(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all shadow-md z-20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 flex flex-col items-center">
              {/* Video Iframe Embed */}
              <div className="w-full aspect-video bg-black">
                <iframe
                  title={viewingVideo.title}
                  src={viewingVideo.fileUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>

              {/* Info Block */}
              <div className="w-full p-6 text-left text-white space-y-2">
                <span className="text-[10px] text-[#D99A1C] font-extrabold uppercase tracking-wider">{viewingVideo.university}</span>
                <h3 className="text-sm font-extrabold">{viewingVideo.title}</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{viewingVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
