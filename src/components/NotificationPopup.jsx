import React, { useState, useEffect } from 'react';
import { notices } from '../data/notices';

const initialNotifications = notices.filter(n => n.popup);

export default function NotificationPopup({ onViewNotice }) {
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem('studegram_read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [closedTimestamps, setClosedTimestamps] = useState(() => {
    try {
      const stored = localStorage.getItem('studegram_closed_notifications');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [now, setNow] = useState(Date.now());
  const [isClosing, setIsClosing] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  // Periodically update the time to refresh the 5-minute timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 5000); // Check every 5 seconds for highly responsive updates
    return () => clearInterval(interval);
  }, []);

  // Filter visible notifications
  const visibleNotifications = initialNotifications.filter((n) => {
    // 1. If marked as read, do not show
    if (readIds.includes(n.id)) return false;

    // 2. If closed, check if 5 minutes have passed
    const closedTime = closedTimestamps[n.id];
    if (closedTime && now - closedTime < 5 * 60 * 1000) {
      return false;
    }

    return true;
  });

  const nextNotification = visibleNotifications[0] || null;

  // Handle setting active notification with transition
  useEffect(() => {
    if (nextNotification?.id !== activeNotification?.id) {
      if (nextNotification) {
        setIsClosing(false);
        setActiveNotification(nextNotification);
      } else {
        // If there's no next notification, animate out first
        setIsClosing(true);
        const timer = setTimeout(() => {
          setActiveNotification(null);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [nextNotification, activeNotification]);

  if (!activeNotification) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      const updatedClosed = { ...closedTimestamps, [activeNotification.id]: Date.now() };
      setClosedTimestamps(updatedClosed);
      localStorage.setItem('studegram_closed_notifications', JSON.stringify(updatedClosed));
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleMarkAsRead = () => {
    setIsClosing(true);
    setTimeout(() => {
      const updatedRead = [...readIds, activeNotification.id];
      setReadIds(updatedRead);
      localStorage.setItem('studegram_read_notifications', JSON.stringify(updatedRead));
      setIsClosing(false);
    }, 300);
  };

  const handleView = () => {
    setIsClosing(true);
    setTimeout(() => {
      const updatedRead = [...readIds, activeNotification.id];
      setReadIds(updatedRead);
      localStorage.setItem('studegram_read_notifications', JSON.stringify(updatedRead));
      setIsClosing(false);
      if (onViewNotice) {
        onViewNotice(activeNotification.id);
      }
    }, 300);
  };

  const isImportant = activeNotification.type === 'important';

  return (
    <div
      className={`fixed top-20 left-1/2 z-50 max-w-2xl w-[calc(100%-2rem)] p-5 rounded-2xl border-2 border-[#D99A1C] transition-all duration-300
        backdrop-blur-md bg-white/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] shadow-[#D99A1C]/20
        overflow-y-auto max-h-[calc(100vh-6rem)]
        ${isClosing ? 'animate-slide-out-top' : 'animate-slide-in-top'}
      `}
    >
      {/* Type-based Top Glow/Gradients */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${
          isImportant ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
        }`}
      />

      {/* Floating Highlighted Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white shadow-md border border-white/20 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 group"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Top Banner Area (always rendered with same height for uniform sizing) */}
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/30 shadow-inner h-56 relative bg-slate-50">
        {activeNotification.image ? (
          <img
            src={activeNotification.image}
            alt={activeNotification.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Premium fallback gradient banner with abstract icon */
          <div className={`w-full h-full bg-gradient-to-tr flex flex-col items-center justify-center relative overflow-hidden
            ${isImportant ? 'from-amber-600 to-rose-700' : 'from-indigo-600 to-violet-700'}
          `}>
            {/* Abstract decorative pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Glowing orb */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-2xl animate-pulse
              ${isImportant ? 'bg-rose-400/30' : 'bg-violet-400/30'}
            `}></div>
            
            <div className={`z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border
              ${isImportant 
                ? 'bg-rose-500/20 border-rose-400/30 text-rose-200 shadow-rose-950/20' 
                : 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200 shadow-indigo-950/20'}
            `}>
              {isImportant ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              )}
            </div>
            <span className="z-10 mt-3 text-[10px] text-white/80 font-bold uppercase tracking-wider">
              {isImportant ? 'Important Alert' : 'System Update'}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-4">
        {/* Badge & Type Icon */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            isImportant
              ? 'bg-rose-50 text-rose-600 border border-rose-100'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
          }`}
        >
          {activeNotification.badge || (isImportant ? 'Important' : 'Update')}
        </span>
      </div>

      <div className="mt-3.5 space-y-2 min-h-[96px]">
        <h4 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
          {activeNotification.title}
        </h4>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold line-clamp-2">
          {activeNotification.message}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={handleClose}
          className="px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold transition-all duration-150 hover:bg-slate-50"
        >
          Remind Me Later
        </button>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAsRead}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all duration-150"
          >
            Mark as Read
          </button>
          <button
            onClick={handleView}
            className={`px-4.5 py-2 rounded-xl text-white text-xs font-bold transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-1.5
              ${isImportant ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-amber-200/50' : 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-indigo-200/50'}
            `}
          >
            <span>View Details</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
