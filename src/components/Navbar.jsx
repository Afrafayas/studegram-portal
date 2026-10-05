import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Navbar({ 
  activePage, 
  partnerData, 
  onBack, 
  onNewApplicationClick, 
  onLogout, 
  onToggleSidebar,
  onNavigatePage,
  onSelectApplication,
  onOpenProfile
}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time Application Comments System
  const [commentsList, setCommentsList] = useState([]);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayInitials = partnerData?.name
    ? partnerData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AG';

  const userRoleDisplay = partnerData?.isStaff
    ? `Agency Staff (${partnerData.role || 'Staff'})`
    : 'Agency SuperAdmin (Owner)';

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount !== undefined ? res.data.unreadCount : (res.data.data ? res.data.data.filter(n => !n.isRead).length : 0));
      }
    } catch (e) {}
  };

  const fetchComments = async () => {
    try {
      const res = await API.get('/applications/recent-comments');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const readStorageKey = 'studegram_portal_read_comments';
        let readIds = new Set();
        try {
          readIds = new Set(JSON.parse(localStorage.getItem(readStorageKey) || '[]'));
        } catch (e) {}

        const updatedList = res.data.data.map(c => {
          const idKey = c.commentId || `${c.applicationId}_${c.createdAt}`;
          const isMarkedRead = readIds.has(idKey);
          return {
            ...c,
            isUnreplied: isMarkedRead ? false : c.isUnreplied,
            isRead: isMarkedRead
          };
        });

        setCommentsList(updatedList);
        const unreplied = updatedList.filter(c => c.isUnreplied).length;
        setUnreadCommentsCount(unreplied);
      }
    } catch (e) {}
  };

  const handleCommentClick = (comm) => {
    setShowComments(false);
    const readStorageKey = 'studegram_portal_read_comments';
    try {
      const readIds = new Set(JSON.parse(localStorage.getItem(readStorageKey) || '[]'));
      const idKey = comm.commentId || `${comm.applicationId}_${comm.createdAt}`;
      readIds.add(idKey);
      localStorage.setItem(readStorageKey, JSON.stringify([...readIds]));
    } catch (e) {}

    setCommentsList(prev => prev.map(c => 
      (c.applicationId === comm.applicationId)
        ? { ...c, isUnreplied: false, isRead: true } 
        : c
    ));
    setUnreadCommentsCount(prev => Math.max(0, prev - 1));

    if (onSelectApplication) {
      onSelectApplication(comm.applicationId);
    } else if (onNavigatePage) {
      onNavigatePage('ApplicationHistory');
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchComments();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchComments();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    try {
      await API.put('/notifications/read-all').catch(() => {});
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
      setUnreadCount(prev => Math.max(0, prev - 1));
      try {
        await API.put(`/notifications/${n._id}/read`).catch(() => {
          API.put('/notifications/read-all').catch(() => {});
        });
      } catch (err) {}
    }
    setShowNotifications(false);

    const extractedCams = (n.message || '').match(/CAMS-\d+/i)?.[0] || (n.title || '').match(/CAMS-\d+/i)?.[0];
    const targetAppId = n.relatedId || n.applicationId || n.targetAppId || n.appId || extractedCams;

    if (targetAppId && onSelectApplication) {
      onSelectApplication(targetAppId);
    } else if (onNavigatePage) {
      onNavigatePage('ApplicationHistory');
    }
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
 
      {/* Right section: Agency Info, Comments, Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        
        {/* Agency and Role details */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white truncate max-w-[180px]">{partnerData?.companyName || partnerData?.name || 'Agent Portal'}</p>
          <p className="text-[10px] text-[#D99A1C] font-semibold">{userRoleDisplay}</p>
        </div>

        {/* Application Comments Icon & Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowComments(!showComments);
              if (showNotifications) setShowNotifications(false);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all relative focus:outline-none cursor-pointer"
            title="Application Comments & Messages"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {unreadCommentsCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow animate-bounce">
                {unreadCommentsCount}
              </span>
            )}
          </button>

          {/* Application Comments Dropdown Drawer */}
          {showComments && (
            <>
              <div 
                onClick={() => setShowComments(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-[#0A0A0F] border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-900 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Application Comments</span>
                      {unreadCommentsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white shadow">
                          {unreadCommentsCount} Unreplied
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400">Admin responses & application messages</p>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-900/60 p-1.5 space-y-1.5">
                  {commentsList.length > 0 ? (
                    commentsList.map((comm, idx) => (
                      <div 
                        key={comm.applicationId || idx} 
                        onClick={() => handleCommentClick(comm)}
                        className={`p-3 rounded-xl transition-all cursor-pointer group ${
                          comm.isUnreplied
                            ? 'bg-blue-950/80 border-l-4 border-l-blue-500 text-blue-100 font-bold shadow-md hover:bg-blue-900'
                            : 'bg-slate-900/50 border-l-4 border-l-emerald-600 text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="text-xs font-extrabold text-white group-hover:text-[#F5B025] transition-colors flex items-center gap-1.5">
                            {comm.isUnreplied && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>}
                            <span>{comm.camsId && !/[0-9a-fA-F]{24}/.test(comm.camsId) ? `${comm.camsId} · ` : ''}{comm.studentName}</span>
                          </h5>
                          <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                            {comm.createdAt ? new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{comm.universityName} - {comm.courseName}</p>
                        <p className="text-[11px] font-semibold mt-1 leading-snug break-words">"{comm.text}"</p>
                        <div className="mt-2 flex items-center justify-between text-[9px]">
                          <span className={`px-2 py-0.5 rounded font-extrabold uppercase ${comm.isUnreplied ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400'}`}>
                            {comm.isUnreplied ? (comm.lastRepliedBy === 'Admin' ? '💬 New Admin Reply' : '💬 Not Replied') : '✓ Replied / Read'}
                          </span>
                          <span className="text-[#D99A1C] font-extrabold group-hover:underline">Open Application →</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs font-medium">
                      No application comments found.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bell Icon with Real-time Notification Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showComments) setShowComments(false);
            }}
            className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all focus:outline-none cursor-pointer"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <>
              <div 
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 top-11 w-80 sm:w-96 bg-[#0A0A0F] border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-900 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Notifications</h4>
                    <p className="text-[10px] text-slate-400">Application updates & system alerts</p>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkRead} 
                      className="text-[10px] text-[#D99A1C] font-extrabold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-900/60 p-1.5 space-y-1">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-xs text-slate-500 text-center font-medium">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n._id || n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 rounded-xl transition-all cursor-pointer group ${
                          !n.isRead 
                            ? 'bg-[#1E1B4B]/90 border-l-4 border-l-[#D99A1C] text-amber-100 font-extrabold shadow-sm hover:bg-[#2E2A72]' 
                            : 'bg-slate-900/40 border-l-4 border-l-slate-700 text-slate-400 opacity-60 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-bold text-xs text-white group-hover:text-[#F5B025] transition-colors flex items-center gap-1.5">
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#D99A1C] inline-block shrink-0 animate-pulse"></span>}
                            <span>{n.title}</span>
                          </p>
                          <span className="text-[9px] text-slate-400 font-normal shrink-0">
                            {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] font-medium mt-1 leading-snug">{n.message}</p>
                        <div className="mt-2 flex items-center justify-between text-[9px]">
                          <span className={`px-2 py-0.5 rounded font-extrabold ${!n.isRead ? 'bg-[#D99A1C] text-black' : 'bg-slate-800 text-slate-500'}`}>
                            {!n.isRead ? 'UNREAD' : 'READ'}
                          </span>
                          <span className="text-[#D99A1C] font-extrabold group-hover:underline">Open Applications →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar with Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              if (showNotifications) setShowNotifications(false);
              if (showComments) setShowComments(false);
            }}
            title="Account & Profile Settings"
            className="relative cursor-pointer group focus:outline-none flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-bold text-black text-xs shadow-md border-2 border-[#0A0A0F] group-hover:scale-105 transition-all">
              {displayInitials}
            </div>
            <span className="absolute bottom-1 left-7 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-[#0A0A0F]"></span>
          </button>

          {showUserMenu && (
            <>
              <div 
                onClick={() => setShowUserMenu(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 top-11 w-64 bg-[#0A0A0F] border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-3 border-b border-slate-900">
                  <p className="text-xs font-bold text-white truncate">{partnerData?.name || 'Agent User'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{partnerData?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#D99A1C]/10 text-[#D99A1C] border border-[#D99A1C]/20">
                    {userRoleDisplay}
                  </span>
                </div>

                <div className="p-1.5 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#D99A1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile & Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
