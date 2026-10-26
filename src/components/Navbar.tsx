import React, { useState } from 'react';
import { 
  Printer, 
  Search, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  CalendarDays, 
  Layers,
  Sparkles,
  PhoneCall,
  LayoutDashboard
} from 'lucide-react';
import { User, DailySlotInfo, AppNotification } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onTrackReference: (ref: string) => void;
  dailySlots: DailySlotInfo;
  isOfficerMode: boolean;
  onToggleOfficerMode: () => void;
  onOpenAdmin: () => void;
  isAdminView: boolean;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenLocationHub: () => void;
  onOpenSubmitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onTrackReference,
  dailySlots,
  isOfficerMode,
  onToggleOfficerMode,
  onOpenAdmin,
  isAdminView,
  unreadCount,
  onOpenNotifications,
  onOpenLocationHub,
  onOpenSubmitModal,
}) => {
  const [quickRef, setQuickRef] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      onTrackReference(quickRef.trim());
      setQuickRef('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro-announcement bar with green gradient */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
              Barangay Kiwalo
            </span>
            <span className="text-emerald-100 font-medium hidden sm:inline">
              Sangguniang Kabataan Youth Development Initiative
            </span>
            <span className="text-emerald-200/60 hidden sm:inline">•</span>
            <span className="text-emerald-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" />
              Daraga, Albay
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={onOpenLocationHub}
              className="text-emerald-100 hover:text-white underline decoration-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Learning Hub Hours: Mon-Fri 8AM - 5PM</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Daily Student Quota: {dailySlots.totalAllowed} slots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={isAdminView ? onOpenAdmin : undefined} 
            className="flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 p-0.5 shadow-md shadow-emerald-700/20 flex items-center justify-center">
              <div className="w-full h-full bg-emerald-950/20 backdrop-blur-xs rounded-[10px] flex items-center justify-center text-white">
                <Printer className="w-5 h-5 text-emerald-100" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 bg-clip-text text-transparent">
                  SK Kiwalo Free Printing
                </h1>
                <span className="hidden lg:inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Youth Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Free Printing for Students of Barangay Kiwalo, Daraga
              </p>
            </div>
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-2">
            <form onSubmit={handleQuickSearch} className="w-full relative">
              <input
                type="text"
                value={quickRef}
                onChange={(e) => setQuickRef(e.target.value)}
                placeholder="Track Ref # (e.g. SKK-2026-4821)"
                className="w-full pl-9 pr-14 py-1.5 text-xs bg-emerald-50/50 hover:bg-emerald-50/90 focus:bg-white border border-emerald-200 focus:border-emerald-500 rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-2.5" />
              <button
                type="submit"
                disabled={!quickRef.trim()}
                className="absolute right-1 top-1 px-2 py-1 text-[10px] font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 rounded cursor-pointer transition-colors"
              >
                Track
              </button>
            </form>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily slots badge */}
            <div 
              onClick={onOpenSubmitModal}
              title="Click to submit printout or check slots"
              className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline text-slate-600">Today:</span>
              <span className="font-bold text-emerald-700">
                {dailySlots.remainingSlots} / {dailySlots.totalAllowed} left
              </span>
            </div>

            {/* Admin Dashboard Dedicated Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isAdminView
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
              }`}
              title="Open the complete SK Print Desk Admin Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
            </button>

            {/* SMS / Email notifications bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="View SMS & Email notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Session Profile / Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    {currentUser.purok}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.fullName.charAt(0)}
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Log out of student account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create Account</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile quick tracking search */}
        <div className="md:hidden pb-2 pt-1 border-t border-slate-100">
          <form onSubmit={handleQuickSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickRef}
                onChange={(e) => setQuickRef(e.target.value)}
                placeholder="Track Reference Number (SKK-2026-XXXX)"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-emerald-50/60 border border-emerald-200 rounded-lg outline-none font-mono"
              />
              <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={!quickRef.trim()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg disabled:opacity-40"
            >
              Track
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
