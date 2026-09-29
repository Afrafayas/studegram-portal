import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Navbar({ activePage, partnerData, onBack, onNewApplicationClick, onLogout, onToggleSidebar }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayInitials = partnerData?.name
    ? partnerData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AG';

  const userRoleDisplay = partnerData?.isStaff
    ? `Agency Staff (${partnerData.role || 'Staff'})`
    : 'Agency SuperAdmin (Owner)';

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  return (
    <nav className="h-[60px] min-h-[60px] bg-[#0A0A0F] border-b border-white/5 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none text-white">
      {/* Left section: Logo & Hamburger toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg focus:outline-none"
          title="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg focus:outline-none transition-all flex items-center justify-center active:scale-95 duration-100"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
 
        <div className="w-8 h-8 md:w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-extrabold text-black text-sm md:text-lg shadow-sm">
          S
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base md:text-xl tracking-tight text-white">
            Studegram
          </span>
          {activePage && (
            <>
              <svg className="w-3.5 h-3.5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7-7" />
              </svg>
              <span className="text-[#D99A1C] font-extrabold text-xs md:text-sm mt-0.5">
                {activePage}
              </span>
            </>
          )}
        </div>
      </div>
 
      {/* Right section: Agency Info, Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        
        {/* Agency and Role details */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white truncate max-w-[180px]">{partnerData?.companyName || partnerData?.name || 'Agent Portal'}</p>
          <p className="text-[10px] text-[#D99A1C] font-semibold">{userRoleDisplay}</p>
        </div>

        {/* New Application Button */}
        <button
          onClick={onNewApplicationClick}
          className="bg-[#D99A1C] hover:bg-[#C28410] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm whitespace-nowrap"
        >
          + New Application
        </button>

        {/* Bell Icon with Real-time Notification Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) handleMarkRead();
            }}
            className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all focus:outline-none"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Notifications</span>
                <button onClick={handleMarkRead} className="text-[10px] text-[#D99A1C] font-semibold hover:underline">Mark all read</button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className={`p-3 text-xs space-y-0.5 ${n.isRead ? 'opacity-70 bg-transparent' : 'bg-slate-950/60'}`}>
                      <p className="font-bold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-500 font-normal">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Sign Out */}
        <button
          onClick={onLogout}
          title="Sign Out / Logout"
          className="relative cursor-pointer group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-bold text-black text-xs shadow-md border-2 border-[#0A0A0F] group-hover:border-rose-500 transition-all">
            {displayInitials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-[#0A0A0F]"></span>
        </button>
      </div>
    </nav>
  );
}
