import { ActionButton } from './ActionControls';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import { reminderDue, snoozeKey } from '../utils/noticeReminder.mjs';
import unigatherLogo from '../assets/unigather-logo.jpg';
const mapNotice = notice => ({ ...notice, id: notice._id, message: notice.content || '', type: notice.category || 'General', badge: notice.badge || notice.priority, image: notice.image || '' });
export default function NotificationPopup({ onViewNotice }) {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [closed, setClosed] = useState({});
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [imageLayout, setImageLayout] = useState(null);
  const generation = useRef(0);
  const storageKey = snoozeKey(localStorage);
  useEffect(() => {
    let active = true;
    const readClosed = () => { try { setClosed(JSON.parse(localStorage.getItem(storageKey) || '{}')); } catch { setClosed({}); } };
    readClosed();
    const load = async () => {
      const version = ++generation.current;
      try {
        const response = await API.get('/notices?reminders=true');
        if (active && version === generation.current && response.data?.success) setNotifications(response.data.data.map(mapNotice));
      } catch { /* Keep current reminders on transient network failures. */ }
    };
    const changed = () => { setNotifications([]); load(); };
    const storageChanged = event => { if (event.key === storageKey) readClosed(); if (event.key === storageKey + ':read') changed(); };
    load();
    const poll = setInterval(load, 15000);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    window.addEventListener('notices-updated', changed);
    window.addEventListener('storage', storageChanged);
    window.addEventListener('focus', load);
    return () => { active = false; clearInterval(poll); clearInterval(clock); window.removeEventListener('notices-updated', changed); window.removeEventListener('storage', storageChanged); window.removeEventListener('focus', load); };
  }, [storageKey]);
  const activeNotification = notifications.find(n => reminderDue(n, closed, now)) || null;
  const isClosing = false;
  const handleClose = () => {
    if (busy) return;
    const next = { ...closed, [activeNotification.id]: Date.now() };
    setClosed(next); setNow(Date.now());
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Session snooze still works. */ }
  };
  const handleMarkAsRead = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await API.patch('/notices/' + activeNotification.id + '/read');
      generation.current++;
      setNotifications(prev => prev.filter(n => n.id !== activeNotification.id));
      window.dispatchEvent(new Event('notices-updated'));
      try { localStorage.setItem(storageKey + ':read', String(Date.now())); } catch { /* Polling also synchronizes receipts. */ }
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to mark notice as read. Please retry.'); }
    finally { setBusy(false); }
  };
  const handleView = () => {
    if (busy) return;
    handleClose();
    onViewNotice?.(activeNotification.id);
  };
  useEffect(() => {
    if (!activeNotification) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [Boolean(activeNotification)]);
  if (!activeNotification) return null;
  const isImportant = activeNotification.type === 'important';
  const isPortrait = imageLayout?.src === activeNotification.image && imageLayout.portrait;

  return createPortal(
    <>
      <div aria-hidden="true" className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" onClick={handleClose} />
      <div
        role="dialog" aria-modal="true" aria-label="Notice reminder"
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-[10000] ${isPortrait ? 'max-w-xl' : 'max-w-2xl'} w-[calc(100%-2rem)] p-5 sm:p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#D99A1C] transition-all duration-300
          bg-white shadow-2xl
          overflow-y-auto max-h-[calc(100vh-5rem)]
          ${isClosing ? 'animate-slide-out-top' : 'animate-slide-in-top'}
        `}
      >
        {/* Header with Unigather Logo & Close button */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img
              src={unigatherLogo}
              alt="Unigather"
              className="w-8 h-8 rounded-lg object-cover shadow-xs border border-slate-200/50 select-none pointer-events-none"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#07163B] tracking-tight leading-tight">
                Unigather
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Official Notice
              </span>
            </div>
          </div>

          <ActionButton
            disabled={busy}
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </ActionButton>
        </div>

        {/* Uploaded Artwork / Notice Image */}
        <div className={`mb-3.5 overflow-hidden rounded-xl border border-slate-100 shadow-inner relative bg-slate-50 ${activeNotification.image ? 'flex items-center justify-center' : 'h-36'}`}>
          {activeNotification.image ? (
            <img
              src={activeNotification.image}
              alt={activeNotification.title}
              onLoad={(event) => {
                const image = event.currentTarget;
                setImageLayout({ src: activeNotification.image, portrait: image.naturalHeight > image.naturalWidth });
              }}
              className="block w-full h-auto max-h-[35vh] sm:max-h-[260px] object-contain rounded-xl"
            />
          ) : (
            /* Premium website theme fallback banner */
            <div className="w-full h-full bg-gradient-to-tr from-[#07163B] via-[#0F172A] to-[#D99A1C] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D99A1C] shadow-lg mb-1.5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="text-[10px] text-white/90 font-bold uppercase tracking-wider">
                {isImportant ? 'Important Notice' : 'System Notice'}
              </span>
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="flex justify-between items-start gap-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isImportant || (activeNotification.badge || '').toLowerCase() === 'high'
                ? 'bg-amber-50 text-[#B87C0E] border border-amber-200/80'
                : 'bg-slate-100 text-[#07163B] border border-slate-200/80'
            }`}
          >
            {activeNotification.badge || (isImportant ? 'Important' : 'Notice')}
          </span>
        </div>

        {/* Title & Message */}
        <div className="mt-2.5 space-y-1.5">
          <h4 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug tracking-tight">
            {activeNotification.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
            {activeNotification.message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2.5 items-center justify-between">
          <ActionButton
            disabled={busy} onClick={handleClose}
            className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Remind Me Later
          </ActionButton>
          <div className="flex items-center gap-2">
            <ActionButton
              disabled={busy} onClick={handleMarkAsRead}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#0F172A] text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              Mark as Read
            </ActionButton>
            <ActionButton
              disabled={busy} onClick={handleView}
              className="px-5 py-2.5 rounded-xl bg-[#D99A1C] hover:bg-[#C28410] text-[#07163B] text-xs font-black transition-all duration-150 shadow-md shadow-amber-500/15 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Details</span>
              <svg className="w-3.5 h-3.5 text-[#07163B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </ActionButton>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
