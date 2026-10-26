import React, { useState } from 'react';
import { 
  CalendarDays, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DailySlotInfo, PrintJob, User } from '../types';
import { 
  getTodayDateString, 
  getDailySlotInfo, 
  getPrintJobs, 
  formatDisplayDate, 
  DAILY_CAPACITY_LIMIT 
} from '../utils/storage';

interface DailyCapacitySectionProps {
  onOpenSubmit: () => void;
  onOpenTrack: (ref: string) => void;
}

export const DailyCapacitySection: React.FC<DailyCapacitySectionProps> = ({
  onOpenSubmit,
  onOpenTrack,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const todayStr = getTodayDateString();

  const slotInfo = getDailySlotInfo(selectedDate);
  const jobs = getPrintJobs().filter(j => j.pickupDate === selectedDate && j.status !== 'Cancelled');

  const shiftDate = (days: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    const newDateStr = `${yyyy}-${mm}-${dd}`;
    if (newDateStr >= todayStr) {
      setSelectedDate(newDateStr);
    }
  };

  // Group booked jobs by Purok
  const purokCounts = {
    'Purok 1': jobs.filter(j => j.purok === 'Purok 1').length,
    'Purok 2': jobs.filter(j => j.purok === 'Purok 2').length,
    'Purok 3': jobs.filter(j => j.purok === 'Purok 3').length,
  };

  return (
    <section className="py-10 bg-gradient-to-b from-white via-emerald-50/40 to-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daily Hub Capacity & Student Slots</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              10 Students Quota Per Day
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              To guarantee fast turnaround and free ink & paper resources for all youth across Purok 1, 2, and 3, our print desk operates with a daily cap of 10 student print requests.
            </p>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => shiftDate(-1)}
              disabled={selectedDate <= todayStr}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-800 px-2 select-none min-w-[140px] text-center">
              {selectedDate === todayStr ? 'Today • ' : ''}{formatDisplayDate(selectedDate)}
            </span>

            <button
              onClick={() => shiftDate(1)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Capacity Overview Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm shadow-emerald-900/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Slot counter numbers */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                  <span className="text-2xl leading-none">{slotInfo.remainingSlots}</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-100">Left</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {slotInfo.remainingSlots > 0 
                      ? `${slotInfo.remainingSlots} Slots Available` 
                      : 'Slots Fully Booked'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {slotInfo.bookedCount} of 10 student slots filled for this date
                  </div>
                </div>
              </div>

              {/* Purok distribution pills */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Booked Students by Purok:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    Purok 1: <strong>{purokCounts['Purok 1']}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                    Purok 2: <strong>{purokCounts['Purok 2']}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-800 border border-green-200 font-medium">
                    Purok 3: <strong>{purokCounts['Purok 3']}</strong>
                  </span>
                </div>
              </div>

              {slotInfo.remainingSlots > 0 ? (
                <button
                  onClick={onOpenSubmit}
                  className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Free Slot for This Day</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Maximum capacity reached for {formatDisplayDate(selectedDate)}. Please choose the next day.</span>
                </div>
              )}
            </div>

            {/* 10 Visual Slot Badges */}
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {Array.from({ length: DAILY_CAPACITY_LIMIT }).map((_, idx) => {
                  const job = jobs[idx];
                  const isTaken = !!job;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between min-h-[96px] ${
                        isTaken
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                          : 'bg-slate-50/60 border-dashed border-slate-300 text-slate-400 hover:border-emerald-400 hover:bg-emerald-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-500">
                          Slot #{idx + 1}
                        </span>
                        {isTaken ? (
                          <span className={`w-2 h-2 rounded-full ${
                            job.status === 'Ready for Pickup' 
                              ? 'bg-emerald-500 animate-pulse'
                              : job.status === 'Printing'
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`} />
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold">Open</span>
                        )}
                      </div>

                      {isTaken ? (
                        <div className="space-y-0.5 my-1">
                          <div className="font-bold text-slate-900 truncate text-[11px]">
                            {job.userName}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium">
                            {job.purok}
                          </div>
                          <button
                            onClick={() => onOpenTrack(job.referenceNumber)}
                            className="font-mono text-[9px] text-slate-500 hover:text-emerald-700 underline truncate block cursor-pointer"
                          >
                            {job.referenceNumber}
                          </button>
                        </div>
                      ) : (
                        <div className="my-auto text-center py-1">
                          <span className="text-[11px] text-slate-400 font-medium block">
                            Available
                          </span>
                          <span className="text-[9px] text-emerald-600">Free printing</span>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1 flex items-center justify-between">
                        {isTaken ? (
                          <span className="truncate text-slate-600">{job.documentType.split('/')[0]}</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold cursor-pointer" onClick={onOpenSubmit}>+ Claim</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
