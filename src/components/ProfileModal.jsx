import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function ProfileModal({ isOpen, onClose, partnerData, onProfileUpdated }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Sync state with partnerData
  useEffect(() => {
    if (partnerData) {
      setName(partnerData.name || '');
      setPhone(partnerData.phone || '');
      setCompanyName(partnerData.companyName || '');
      setPlace(partnerData.place || '');
      setAddress(partnerData.address || '');
      setCity(partnerData.city || '');
      setCountry(partnerData.country || 'India');
    }
  }, [partnerData, isOpen]);

  if (!isOpen) return null;

  const displayInitials = (partnerData?.name || name || 'AG')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name is required.');
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await API.put('/partners/profile', {
        name: name.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        place: place.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim()
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Profile updated successfully!');
        if (onProfileUpdated) onProfileUpdated();
      } else {
        throw new Error(res.data?.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error updating profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setPasswordError('Please enter your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await API.put('/partners/change-password', {
        currentPassword,
        newPassword
      });

      if (res.data?.success) {
        setPasswordSuccess(res.data.message || 'Password updated successfully! You can now use this new password.');
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.data?.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0A0A0F] to-[#1E1B4B] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-black text-black text-xl shadow-lg border-2 border-white/20">
                {displayInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">{name || partnerData?.name || 'Agent Profile'}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {partnerData?.companyName || 'Educational Agency'} · <span className="text-[#D99A1C] font-semibold">{partnerData?.isStaff ? `Staff (${partnerData?.role})` : 'Agency Admin'}</span>
                </p>
                <p className="text-[11px] text-slate-400">{partnerData?.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-2 border-t border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#D99A1C] to-[#F5B025] text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile Details</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('password');
                setPasswordError('');
                setPasswordSuccess('');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-[#D99A1C] to-[#F5B025] text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Edit / Reset Password</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider flex items-center gap-2">
                  <span>General Information</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Contact Person Name *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Registered Email */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Registered Email (Read Only)</label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-semibold cursor-not-allowed"
                        value={partnerData?.email || ''}
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Company / Agency Name */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Company / Agency Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  {/* Location / Place */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Place / Area</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Country</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">Full Postal Address</label>
                    <textarea
                      rows="2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-extrabold rounded-xl text-xs shadow-md transition-all uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-[#0F172A] tracking-wider">
                    Change / Reset Password
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Enter the 6-digit password received from admin or your current password, and set your new chosen password.
                  </p>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-semibold flex items-center gap-2">
                    <span>✓</span>
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
                    Current Password (or 6-Digit Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                    >
                      {showCurrentPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirm Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      New Password (Min 6 Characters) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                      >
                        {showNewPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99A1C]"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed font-medium">
                  💡 <strong>Security Note:</strong> After updating, this new password will become your primary password for signing in to the Agent Portal.
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D99A1C] to-[#F5B025] hover:scale-[1.01] text-white font-extrabold rounded-xl text-xs shadow-md transition-all uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSavingPassword ? 'Updating Password...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
