import React, { useState } from 'react';

export default function Navbar({ onNewApplicationClick, onLogout, onToggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="h-[60px] min-h-[60px] bg-[#0A0A0F] border-b border-white/5 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none text-white">
      {/* Left section: Logo & Hamburger toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Hamburger Menu Toggle (Mobile only) */}
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg focus:outline-none"
          title="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
 
        {/* Logo Mark: Gradient with black text */}
        <div className="w-8 h-8 md:w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-extrabold text-black text-sm md:text-lg shadow-sm">
          S
        </div>
        <span className="font-extrabold text-base md:text-xl tracking-tight text-white">
          Studegram
        </span>
      </div>
 
      {/* Center section: Rounded search bar */}
      <div className="relative w-full max-w-md mx-4 hidden sm:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-[#121212] focus:border-[#D99A1C] focus:ring-1 focus:ring-[#D99A1C] transition-all"
          placeholder="Search students, CAMS ID, universities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
 
      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* "New Application" Mustard Button */}
        <button
          onClick={onNewApplicationClick}
          className="bg-[#D99A1C] hover:bg-[#C28410] text-black font-extrabold text-xs px-4 py-2 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-95 shadow-sm whitespace-nowrap"
        >
          New Application
        </button>
 
        {/* Bell Icon with red dot badge */}
        <button className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all duration-150">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#0A0A0F]"></span>
        </button>
 
        {/* User avatar with green online dot - click to logout */}
        <button
          onClick={onLogout}
          title="Sign Out / Logout"
          className="relative cursor-pointer group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D99A1C] to-[#F5B025] flex items-center justify-center font-bold text-black text-xs shadow-md border-2 border-[#0A0A0F] group-hover:border-rose-500 transition-all">
            JD
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-[#0A0A0F]"></span>
        </button>
      </div>
    </nav>
  );
}
