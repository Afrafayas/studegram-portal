import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function ClaimCommissionConfirmModal({ isOpen, onClose, application, onConfirmed }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !application) return null;

  const appId = application.id || application._id;
  const studentName = application.studentName || application.student?.name || 'Student';
  const camsId = application.camsId || 'N/A';
  const universityName = application.universityName || application.university?.name || '';
  const courseName = application.courseName || application.course?.name || '';

  const handleConfirm = async () => {
    if (!appId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await API.post(`/applications/${appId}/claim-commission`);
      if (res.data?.success) {
        toast.success(`Commission claim submitted for ${studentName} successfully!`);
        if (onConfirmed) {
          onConfirmed(appId);
        }
        onClose();
      } else {
        toast.error(res.data?.message || 'Failed to claim commission');
      }
    } catch (err) {
      console.error('Error claiming commission:', err);
      toast.error(err.response?.data?.message || 'Failed to claim commission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-commission-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-center animate-in zoom-in-95 duration-150"
      >
        {/* Close "X" Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Currency / Payout Icon */}
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50/60 shadow-inner">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Badge & Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200/80 tracking-wider">
            Payout Request
          </span>
          <h3 id="claim-commission-title" className="text-base font-bold text-[#0F172A] pt-1">
            Claim Agency Commission
          </h3>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Student:</span>
            <span className="font-bold text-slate-800">{studentName}</span>
          </div>
          {camsId !== 'N/A' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Application ID:</span>
              <span className="font-bold text-[#D99A1C]">{camsId}</span>
            </div>
          )}
          {universityName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">University:</span>
              <span className="font-bold text-slate-700 truncate max-w-[200px]" title={universityName}>{universityName}</span>
            </div>
          )}
          {courseName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Course:</span>
              <span className="font-bold text-slate-700 truncate max-w-[200px]" title={courseName}>{courseName}</span>
            </div>
          )}
        </div>

        {/* Informational Message */}
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Are you sure you want to submit this commission claim? Once confirmed, your claim will be forwarded to the Studgram Admin team for review and disbursement.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25 active:scale-[0.98] flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Confirm & Claim</span>
                <span className="text-sm leading-none">💰</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
