import React, { useState, useEffect } from 'react';

const initialNotifications = [
  {
    id: 'notif-1',
    title: '📢 Admission Portal Update',
    message: 'The new September 2026 intake applications are now open! Make sure to verify admission criteria before submitting.',
    type: 'update',
    badge: 'New Intake',
  },
  {
    id: 'notif-2',
    title: '⚠️ System Upgrade Maintenance',
    message: 'The student portal will undergo server upgrades tonight at 11:30 PM. Expect brief downtimes of up to 10 minutes.',
    type: 'important',
    badge: 'Critical',
  },
  {
    id: 'notif-3',
    title: '🎉 Document Verification Optimization',
    message: 'We have optimized the document verification engine. PDF verification is now 3x faster.',
    type: 'update',
    badge: 'Speed Boost',
  }
];

export default function NotificationPopup() {
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

  const isImportant = activeNotification.type === 'important';

  return (
    <div
      className={`fixed top-20 left-1/2 z-50 max-w-sm w-full p-5 rounded-2xl border transition-all duration-300
        backdrop-blur-md bg-white/80 border-slate-200/50 shadow-xl shadow-slate-200/40
        ${isClosing ? 'animate-slide-out-top' : 'animate-slide-in-top'}
      `}
    >
      {/* Type-based Top Glow/Gradients */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${
          isImportant ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
        }`}
      />

      <div className="flex justify-between items-start gap-4">
        {/* Badge & Type Icon */}
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isImportant
              ? 'bg-rose-50 text-rose-600 border border-rose-100'
              : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
          }`}
        >
          {activeNotification.badge || (isImportant ? 'Important' : 'Update')}
        </span>

        {/* Small Close Icon Button */}
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100/50"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-3 space-y-1.5">
        <h4 className="text-sm font-bold text-slate-800 leading-snug">
          {activeNotification.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {activeNotification.message}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        <button
          onClick={handleClose}
          className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 text-xs font-bold transition-all duration-150 hover:bg-slate-50"
        >
          Remind Me Later
        </button>
        <button
          onClick={handleMarkAsRead}
          className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-md
            ${isImportant ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200/50' : 'bg-[#6366F1] hover:bg-[#5053e3] shadow-indigo-200/50'}
          `}
        >
          Mark as Read
        </button>
      </div>
    </div>
  );
}
