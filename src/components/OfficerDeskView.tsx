import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Filter, 
  Search, 
  CheckCircle, 
  Clock, 
  BellRing, 
  CheckCheck, 
  ArrowRight, 
  Sparkles,
  Download,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { PrintJob, Purok, JobStatus } from '../types';
import { PUROK_OPTIONS, formatDisplayDate, formatTimeAgo } from '../utils/storage';

interface OfficerDeskViewProps {
  jobs: PrintJob[];
  onUpdateStatus: (jobId: string, status: JobStatus, notes?: string) => void;
  onOpenTrack: (ref: string) => void;
  onExitOfficerMode: () => void;
}

export const OfficerDeskView: React.FC<OfficerDeskViewProps> = ({
  jobs,
  onUpdateStatus,
  onOpenTrack,
  onExitOfficerMode,
}) => {
  const [filterPurok, setFilterPurok] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredJobs = jobs.filter(j => {
    if (filterPurok !== 'all' && j.purok !== filterPurok) return false;
    if (filterStatus !== 'all' && j.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.referenceNumber.toLowerCase().includes(q) ||
        j.userName.toLowerCase().includes(q) ||
        j.documentTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate desk stats
  const totalPages = jobs.reduce((sum, j) => sum + (j.pageCount * j.copies), 0);
  const queuedCount = jobs.filter(j => j.status === 'Queued').length;
  const printingCount = jobs.filter(j => j.status === 'Printing').length;
  const readyCount = jobs.filter(j => j.status === 'Ready for Pickup').length;
  const completedCount = jobs.filter(j => j.status === 'Completed').length;

  return (
    <section className="py-8 bg-slate-900 text-white min-h-[600px] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Officer Desk Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  SK Kiwalo Learning Hub • Print Desk Terminal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Officer Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage print queue, advance print statuses, and broadcast automated SMS alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExitOfficerMode}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Exit Desk Mode
            </button>
          </div>
        </div>

        {/* Real-time Desk Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-xs block">Queued Requests</span>
            <span className="text-2xl font-extrabold text-amber-400">{queuedCount}</span>
            <span className="text-[10px] text-slate-400 block">Awaiting print</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-xs block">Printing Right Now</span>
            <span className="text-2xl font-extrabold text-blue-400">{printingCount}</span>
            <span className="text-[10px] text-slate-400 block">On Desk HP LaserJet</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-xs block">Ready for Pickup</span>
            <span className="text-2xl font-extrabold text-emerald-400">{readyCount}</span>
            <span className="text-[10px] text-emerald-300/80 block">SMS sent to students</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-xs block">Total Pages Printed</span>
            <span className="text-2xl font-extrabold text-white">{totalPages}</span>
            <span className="text-[10px] text-slate-400 block">Free paper & ink granted</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Purok:</span>
            </span>
            <select
              value={filterPurok}
              onChange={(e) => setFilterPurok(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
            >
              <option value="all">All Puroks (1, 2, 3)</option>
              {PUROK_OPTIONS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <span className="text-slate-400 ml-2">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Queued">Queued</option>
              <option value="Printing">Printing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, student..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-600 focus:border-emerald-500 rounded-lg text-xs text-white outline-none placeholder:text-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Table of Queue Items */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Tracking Ref</th>
                  <th className="py-3 px-4">Student & Purok</th>
                  <th className="py-3 px-4">Document Specs</th>
                  <th className="py-3 px-4">Pickup Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Officer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No print requests match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        <button
                          onClick={() => onOpenTrack(job.referenceNumber)}
                          className="hover:underline cursor-pointer"
                        >
                          {job.referenceNumber}
                        </button>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {formatTimeAgo(job.createdAt)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{job.userName}</div>
                        <div className="text-[11px] text-emerald-300">
                          {job.purok} • 📱 {job.userContact}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 truncate max-w-xs">
                          {job.documentTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {job.documentType} • {job.pageCount} pgs • {job.paperSize} • {job.colorMode}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">
                          {formatDisplayDate(job.pickupDate)}
                        </div>
                        <div className="text-[10px] text-slate-400">Hub: 8AM-5PM</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'Ready for Pickup'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : job.status === 'Printing'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : job.status === 'Completed'
                            ? 'bg-slate-600/40 text-slate-300 border border-slate-600'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {job.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {job.status === 'Queued' && (
                            <button
                              onClick={() => onUpdateStatus(job.id, 'Printing', 'Loaded into desk printer by SK officer.')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded cursor-pointer transition-colors"
                            >
                              Print Now
                            </button>
                          )}

                          {job.status === 'Printing' && (
                            <button
                              onClick={() => onUpdateStatus(job.id, 'Ready for Pickup', 'Printed & packaged. Ready at 2nd Flr desk.')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <BellRing className="w-3 h-3" />
                              <span>Mark Ready & SMS</span>
                            </button>
                          )}

                          {job.status === 'Ready for Pickup' && (
                            <button
                              onClick={() => onUpdateStatus(job.id, 'Completed', 'Handed over to student at Barangay Kiwalo Hub.')}
                              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] rounded cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <CheckCheck className="w-3 h-3" />
                              <span>Claimed</span>
                            </button>
                          )}

                          {job.status === 'Completed' && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Archived ✓
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
