import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddApplicationModal from './components/AddApplicationModal';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import EditApplicationModal from './components/EditApplicationModal';
import NotificationPopup from './components/NotificationPopup';
import LogoutConfirmModal from './components/LogoutConfirmModal';

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
import StaffManagement from './pages/StaffManagement';
import AgentRolePermissions from './pages/AgentRolePermissions';
import API from './api/axios';
import { useToast } from './context/ToastContext';

export default function App() {
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('partner_token') ? 'dashboard' : 'login';
  }); // Starts as 'login' or 'dashboard' if already logged in
  const [partnerData, setPartnerData] = useState(() => {
    try {
      const saved = localStorage.getItem('partner_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('studegram_portal_active_page') || 'Dashboard';
  });
  const [navigationHistory, setNavigationHistory] = useState([]);
  const prevActivePageRef = useRef(localStorage.getItem('studegram_portal_active_page') || 'Dashboard');
  const isBackNavRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('studegram_portal_active_page', activePage);
  }, [activePage]);

  useEffect(() => {
    if (isBackNavRef.current) {
      isBackNavRef.current = false;
      prevActivePageRef.current = activePage;
      return;
    }

    const prevPage = prevActivePageRef.current;

    if (prevPage !== activePage) {
      setNavigationHistory(prev => {
        const last = prev[prev.length - 1];
        if (last === prevPage) {
          return prev;
        }
        return [...prev, prevPage];
      });
    }

    prevActivePageRef.current = activePage;
  }, [activePage]);

  const handleBack = navigationHistory.length > 0 ? () => {
    const prevPage = navigationHistory[navigationHistory.length - 1];
    if (prevPage) {
      isBackNavRef.current = true;
      setActivePage(prevPage);
      prevActivePageRef.current = prevPage;
      setNavigationHistory(prev => prev.slice(0, -1));
    }
  } : null;
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [selectedAppForEdit, setSelectedAppForEdit] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  const [applications, setApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState(null);
  const [pendingVerificationModalOpen, setPendingVerificationModalOpen] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

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
        intake: app.intake || 'September 2026',
        documents: app.documents || [],
        notes: app.notes || '',
        applicationComments: app.applicationComments || [],
        commissionStatus: app.commissionStatus || 'Unclaimed',
        paymentStatus: app.paymentStatus || 'Paid',
        commissionAmount: app.commissionAmount || 500
      }));
      setApplications(mapped);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const fetchPartnerProfile = async () => {
    const token = localStorage.getItem('partner_token');
    if (!token) return;
    try {
      const res = await API.get('/partners/me');
      if (res.data?.success && res.data?.data) {
        setPartnerData(res.data.data);
        localStorage.setItem('partner_data', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.warn('Failed to refresh partner profile:', err.message);
    }
  };

  React.useEffect(() => {
    if (currentPage === 'dashboard') {
      fetchApplications();
      fetchPartnerProfile();
    } else if (currentPage === 'history') {
      fetchApplications();
    }
  }, [currentPage, activePage]);

  const handleAddApplicationSubmit = async (selectedData) => {
    const token = localStorage.getItem('partner_token');
    if (!token) return false;

    try {
      const res = await API.post('/applications', {
        student: selectedData.studentId,
        course: selectedData.courseId,
        university: selectedData.universityId,
        intake: selectedData.intake,
        documents: selectedData.documents || [],
        notes: selectedData.notes
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
    localStorage.removeItem('studegram_portal_active_page');
    setNavigationHistory([]);
    prevActivePageRef.current = 'Dashboard';
    setActivePage('Dashboard');
    setCurrentPage('login');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <Dashboard 
            applications={applications}
            partnerName={partnerData?.name || partnerData?.companyName || 'Partner'}
            onViewDetails={(app) => setSelectedAppForDetails(app)}
            onViewHistory={() => setActivePage('ApplicationHistory')}
            onNavigateDeadlines={() => setActivePage('UniversityDeadline')}
            onNewApplicationClick={handleOpenNewApplicationModal}
          />
        );
      case 'ApplicationHistory':
        return (
          <ApplicationHistory 
            onAddApplicationClick={handleOpenNewApplicationModal} 
            applications={applications}
            duplicateAlert={duplicateAlert}
            setDuplicateAlert={setDuplicateAlert}
            onViewDetails={(app) => setSelectedAppForDetails(app)}
            onEditClick={(app) => setSelectedAppForEdit(app)}
            onRefreshApplications={fetchApplications}
          />
        );
      case 'SearchCourses':
        return <SearchCourses onApplyCourse={handleOpenNewApplicationModal} />;
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
      case 'StaffManagement':
        return <StaffManagement partnerData={partnerData} />;
      case 'RoleManagement':
        return <AgentRolePermissions partnerData={partnerData} />;
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
          localStorage.setItem('studegram_portal_active_page', 'Dashboard');
          setNavigationHistory([]);
          prevActivePageRef.current = 'Dashboard';
          try {
            const saved = localStorage.getItem('partner_data');
            setPartnerData(saved ? JSON.parse(saved) : null);
          } catch {}
        }} 
      />
    );
  }

  if (currentPage === 'register') {
    return <Register onNavigate={setCurrentPage} />;
  }

  const handleOpenNewApplicationModal = () => {
    if (partnerData?.status === 'Pending') {
      setPendingVerificationModalOpen(true);
      return;
    }
    setShowModal(true);
  };

  // Full Portal Routing
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-[#0F172A] select-text">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage}
        partnerData={partnerData}
        onBack={handleBack}
        onNewApplicationClick={handleOpenNewApplicationModal} 
        onLogout={() => setShowLogoutConfirmModal(true)} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigatePage={(page) => setActivePage(page)}
        onSelectApplication={(appId) => {
          setActivePage('ApplicationHistory');
          if (typeof appId === 'object' && appId !== null) {
            setSelectedAppForDetails(appId);
          } else if (appId) {
            const found = applications.find(a => a._id === appId || a.id === appId);
            if (found) setSelectedAppForDetails(found);
          }
        }}
      />

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          partnerData={partnerData}
          onLogout={() => setShowLogoutConfirmModal(true)} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewApplicationClick={handleOpenNewApplicationModal}
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
        onUpdateSuccess={fetchApplications}
      />

      {/* Edit Application Modal */}
      <EditApplicationModal
        isOpen={!!selectedAppForEdit}
        onClose={() => setSelectedAppForEdit(null)}
        application={selectedAppForEdit}
        onUpdateSuccess={fetchApplications}
      />

      {/* Persistent Notification Popups */}
      <NotificationPopup
        onViewNotice={(noticeId) => {
          setActivePage('Notice');
          setSelectedNoticeId(noticeId);
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirmModal}
        onClose={() => setShowLogoutConfirmModal(false)}
        onConfirm={handleLogout}
      />

      {/* Verification Pending Modal */}
      {pendingVerificationModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                Registration Under Review
              </span>
              <h3 className="text-xl font-bold text-[#0F172A] pt-1">
                Verification Pending
              </h3>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              Your agency registration is currently under review by the Studgram Admin team. Please wait for verification and approval before submitting student applications or managing agency staff.
            </p>

            <button
              onClick={() => setPendingVerificationModalOpen(false)}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



