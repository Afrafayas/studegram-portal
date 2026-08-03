import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddApplicationModal from './components/AddApplicationModal';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import NotificationPopup from './components/NotificationPopup';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Portal Pages
import Dashboard from './pages/Dashboard';
import ApplicationHistory from './pages/ApplicationHistory';
import SearchCourses from './pages/SearchCourses';
import Notice from './pages/Notice';
import UniversityDeadline from './pages/UniversityDeadline';
import Universities from './pages/Universities';
import KnowledgeHub from './pages/KnowledgeHub';
import Scholarships from './pages/Scholarships';
import Webinar from './pages/Webinar';
import API from './api/axios';
import { useToast } from './context/ToastContext';

export default function App() {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('partner_token') ? 'dashboard' : 'login';
  }); // Starts as 'login' or 'dashboard' if already logged in
  const [activePage, setActivePage] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const [applications, setApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  const fetchApplications = async () => {
    const token = localStorage.getItem('partner_token');
    if (!token) return;

    setIsLoadingApps(true);
    try {
      const res = await API.get('/applications');
      const data = res.data;
      const mapped = (data.data || []).map((app, idx) => ({
        id: app._id,
        camsId: `CAMS-${10001 + idx}`,
        studentName: app.student?.name || 'N/A',
        passportNo: app.student?.passportNo || 'N/A',
        universityName: app.university?.name || 'N/A',
        courseName: app.course?.title || 'N/A',
        primaryStatus: app.status || 'Submitted',
        secondaryStatus: app.status || 'Submitted',
        status: app.status || 'Submitted',
        statusHistory: app.statusHistory || [],
        dateAdded: new Date(app.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        modifiedDate: new Date(app.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        student: app.student,
        course: app.course,
        university: app.university,
        documents: app.documents || []
      }));
      setApplications(mapped);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  React.useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'history') {
      fetchApplications();
    }
  }, [currentPage]);

  const handleAddApplicationSubmit = async (selectedData) => {
    const token = localStorage.getItem('partner_token');
    if (!token) return false;

    try {
      const res = await API.post('/applications', {
        student: selectedData.studentId,
        course: selectedData.courseId,
        university: selectedData.universityId,
        documents: selectedData.documents || []
      });

      const data = res.data;
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to submit application');
      }

      fetchApplications();
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error submitting application');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_data');
    localStorage.removeItem('studegram_closed_notifications');
    localStorage.removeItem('studegram_read_notifications');
    setCurrentPage('login');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'ApplicationHistory':
        return (
          <ApplicationHistory 
            onAddApplicationClick={() => setShowModal(true)} 
            applications={applications}
            duplicateAlert={duplicateAlert}
            setDuplicateAlert={setDuplicateAlert}
            onViewDetails={(app) => setSelectedAppForDetails(app)}
          />
        );
      case 'SearchCourses':
        return <SearchCourses />;
      case 'Notice':
        return <Notice selectedNoticeId={selectedNoticeId} setSelectedNoticeId={setSelectedNoticeId} />;
      case 'UniversityDeadline':
        return <UniversityDeadline />;
      case 'Universities':
        return <Universities setActivePage={setActivePage} />;
      case 'KnowledgeHub':
        return <KnowledgeHub />;
      case 'Scholarships':
        return <Scholarships setActivePage={setActivePage} />;
      case 'Webinar':
        return <Webinar />;
      default:
        return (
          <div className="flex-1 p-8 flex items-center justify-center min-h-[calc(100vh-100px)] bg-[#F0F2F5]">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-sm text-center shadow-md space-y-4 hover:shadow-lg transition-all duration-200">
              <div className="w-14 h-14 bg-indigo-50 text-[#D99A1C] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{activePage.replace(/([A-Z])/g, ' $1').trim()}</h2>
                <p className="text-[11px] text-[#64748B] font-semibold leading-relaxed">This section is being synchronized under the new Studegram data framework.</p>
              </div>
              <button 
                onClick={() => setActivePage('Dashboard')}
                className="bg-[#D99A1C] hover:bg-[#C28410] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md inline-flex items-center gap-1.5"
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  // Auth Routing
  if (currentPage === 'login') {
    return (
      <Login 
        onNavigate={setCurrentPage} 
        onLoginSuccess={() => {
          setCurrentPage('dashboard');
          setActivePage('Dashboard');
        }} 
      />
    );
  }

  if (currentPage === 'register') {
    return <Register onNavigate={setCurrentPage} />;
  }

  // Full Portal Routing
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-[#0F172A] select-text">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage}
        onNewApplicationClick={() => setShowModal(true)} 
        onLogout={handleLogout} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onLogout={handleLogout} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Add Application Multi-step Modal */}
      <AddApplicationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSubmit={handleAddApplicationSubmit}
      />

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={!!selectedAppForDetails}
        onClose={() => setSelectedAppForDetails(null)}
        application={selectedAppForDetails}
      />

      {/* Persistent Notification Popups */}
      <NotificationPopup
        onViewNotice={(noticeId) => {
          setActivePage('Notice');
          setSelectedNoticeId(noticeId);
        }}
      />
    </div>
  );
}
