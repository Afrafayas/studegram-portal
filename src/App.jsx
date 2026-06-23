import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddApplicationModal from './components/AddApplicationModal';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Portal Pages
import Dashboard from './pages/Dashboard';
import ApplicationHistory from './pages/ApplicationHistory';
import SearchCourses from './pages/SearchCourses';
import Notice from './pages/Notice';
import UniversityDeadline from './pages/UniversityDeadline';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Starts as 'login'
  const [activePage, setActivePage] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'ApplicationHistory':
        return <ApplicationHistory onAddApplicationClick={() => setShowModal(true)} />;
      case 'SearchCourses':
        return <SearchCourses />;
      case 'Notice':
        return <Notice />;
      case 'UniversityDeadline':
        return <UniversityDeadline />;
      default:
        return (
          <div className="flex-1 p-8 flex items-center justify-center min-h-[calc(100vh-100px)] bg-[#F0F2F5]">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-sm text-center shadow-md space-y-4 hover:shadow-lg transition-all duration-200">
              <div className="w-14 h-14 bg-indigo-50 text-[#6366F1] rounded-full flex items-center justify-center mx-auto shadow-inner">
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
                className="bg-[#6366F1] hover:bg-[#5053e3] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md inline-flex items-center gap-1.5"
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
        onNewApplicationClick={() => setShowModal(true)} 
        onLogout={() => setCurrentPage('login')} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onLogout={() => setCurrentPage('login')} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Add Application Multi-step Modal */}
      <AddApplicationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
