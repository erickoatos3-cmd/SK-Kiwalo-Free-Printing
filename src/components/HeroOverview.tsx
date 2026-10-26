import React from 'react';
import { 
  Printer, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  UploadCloud, 
  Search, 
  BellRing, 
  Users, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DailySlotInfo } from '../types';

interface HeroOverviewProps {
  dailySlots: DailySlotInfo;
  onOpenSubmit: () => void;
  onOpenTrack: () => void;
  onOpenLocation: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  isLoggedIn: boolean;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  dailySlots,
  onOpenSubmit,
  onOpenTrack,
  onOpenLocation,
  onOpenAuth,
  isLoggedIn,
}) => {
  const percentTaken = (dailySlots.bookedCount / dailySlots.totalAllowed) * 100;

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white">
      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sangguniang Kabataan • Barangay Kiwalo Youth Portal</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                SK Kiwalo <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200 bg-clip-text text-transparent">
                  Free Printing Initiative
                </span>
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed pt-1">
                Free printing initiative for students and youth of <strong className="text-white font-semibold">Barangay Kiwalo</strong>. Upload your school modules, research papers, reviewers, or documents online. Our print desk prints them for free and instantly sends you an email or SMS notification when ready for pickup.
              </p>
            </div>

            {/* Hub Location & Hours Badge */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-emerald-500/30 backdrop-blur-md space-y-2 text-xs sm:text-sm text-emerald-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">SK Kiwalo Learning Hub:</span>{' '}
                  Residents can pick up their completed printouts during office hours:{' '}
                  <span className="text-emerald-300 font-medium">Monday to Friday, 8:00 AM - 5:00 PM</span>.
                  <div className="text-xs text-emerald-200/80 pt-0.5">
                    2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga Albay.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSubmit}
                className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 text-emerald-950 hover:brightness-105 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Print Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTrack}
                className="px-4 py-3 rounded-xl font-semibold text-sm bg-emerald-800/60 hover:bg-emerald-800 text-white border border-emerald-600/50 hover:border-emerald-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Track Reference #</span>
              </button>

              <button
                onClick={onOpenLocation}
                className="px-3.5 py-3 rounded-xl text-xs font-medium text-emerald-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Hub Guide & Rules</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-800/50 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-100">Tracking Reference #</span>
              </div>
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-100">Instant SMS & Email Alert</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-100">3 Kiwalo Puroks Covered</span>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Capacity Card & Slot Tracker */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-emerald-900/90 to-teal-950/90 rounded-2xl border border-emerald-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold">
                    10
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Daily Hub Capacity
                    </h2>
                    <p className="text-xs text-emerald-200">
                      10 student quota per day
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    dailySlots.remainingSlots > 3 
                      ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40' 
                      : dailySlots.remainingSlots > 0 
                      ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40' 
                      : 'bg-red-500/20 text-red-200 border border-red-400/40'
                  }`}>
                    {dailySlots.remainingSlots > 0 ? `${dailySlots.remainingSlots} Slots Open` : 'Fully Booked'}
                  </span>
                </div>
              </div>

              {/* Visual 10-Slot Indicators */}
              <div className="py-4 space-y-2">
                <div className="flex justify-between text-xs text-emerald-200">
                  <span>Reserved Today: <strong>{dailySlots.bookedCount} students</strong></span>
                  <span>Available: <strong>{dailySlots.remainingSlots}</strong></span>
                </div>

                <div className="grid grid-cols-10 gap-1.5 py-1">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const isTaken = idx < dailySlots.bookedCount;
                    return (
                      <div
                        key={idx}
                        title={`Slot ${idx + 1}: ${isTaken ? 'Reserved' : 'Available'}`}
                        className={`h-8 rounded-md flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
                          isTaken
                            ? 'bg-emerald-700/80 text-emerald-200/90 border border-emerald-600'
                            : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-400/30'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-emerald-300/80 italic">
                  To ensure fair access across all 3 puroks, printing is scheduled for up to 10 youth/students daily.
                </p>
              </div>

              {/* Student Portal Mini Callout */}
              <div className="mt-4 pt-4 border-t border-emerald-700/50 bg-emerald-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Student Account Active</div>
                      <div className="text-[11px] text-emerald-200">Ready to submit modules & track jobs</div>
                    </div>
                    <button
                      onClick={onOpenSubmit}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg cursor-pointer transition-colors"
                    >
                      New Print Job +
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-100 flex items-center justify-between">
                      <span className="font-semibold text-white">Barangay Kiwalo Youth Portal</span>
                      <span className="text-[10px] text-emerald-300">Free Student Account</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/80 leading-normal">
                      Create your account once to verify eligibility, submit modules online, and track your print jobs for future school semesters.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => onOpenAuth('register')}
                        className="flex-1 py-1.5 text-xs font-bold text-center bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-lg cursor-pointer transition-colors"
                      >
                        Create Account (4-PIN)
                      </button>
                      <button
                        onClick={() => onOpenAuth('login')}
                        className="px-4 py-1.5 text-xs font-medium text-emerald-200 hover:text-white bg-emerald-900/60 hover:bg-emerald-800 rounded-lg cursor-pointer transition-colors"
                      >
                        Log In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
