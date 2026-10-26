import React from 'react';
import { 
  User, 
  PrintJob 
} from '../types';
import { 
  Printer, 
  UploadCloud, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Copy, 
  FileText, 
  Calendar, 
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatDisplayDate, formatTimeAgo } from '../utils/storage';

interface StudentDashboardProps {
  currentUser: User;
  userJobs: PrintJob[];
  onOpenSubmit: () => void;
  onOpenTrack: (ref: string) => void;
  onCancelJob: (jobId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  userJobs,
  onOpenSubmit,
  onOpenTrack,
  onCancelJob,
}) => {
  const readyJobs = userJobs.filter(j => j.status === 'Ready for Pickup');
  const activeJobs = userJobs.filter(j => j.status === 'Queued' || j.status === 'Printing');
  const completedJobs = userJobs.filter(j => j.status === 'Completed');

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Profile & Welcome Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentUser.fullName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentUser.purok}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>📱 {currentUser.contactNumber}</span>
                {currentUser.schoolName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">{currentUser.schoolName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmit}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit New Module</span>
            </button>
          </div>
        </div>

        {/* Ready for Pickup Alert Banner if any */}
        {readyJobs.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg shadow-emerald-700/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  You have {readyJobs.length} printout{readyJobs.length > 1 ? 's' : ''} ready for pickup!
                </h4>
                <p className="text-xs text-emerald-100">
                  Please proceed to the <strong>2nd Floor, Kiwalo Multi-purpose Hall</strong> during hub hours (Mon-Fri 8AM - 5PM).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {readyJobs.map((rj) => (
                <button
                  key={rj.id}
                  onClick={() => onOpenTrack(rj.referenceNumber)}
                  className="px-3 py-1.5 bg-white text-emerald-900 font-bold text-xs rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pass: {rj.referenceNumber}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User's Print Jobs List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-800">
                Your Print Requests & Modules
              </h4>
              <p className="text-xs text-slate-500">
                Tracking history for current and past school terms
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: {userJobs.length} records
            </span>
          </div>

          {userJobs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-slate-700">No print requests submitted yet</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your school modules, research paper, or reviewers for free printing by the SK Kiwalo print desk.
              </p>
              <button
                onClick={onOpenSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload First Document</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {userJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="p-4 sm:p-5 hover:bg-emerald-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {job.referenceNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        job.status === 'Ready for Pickup'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : job.status === 'Printing'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : job.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-slate-800">
                      {job.documentTitle}
                    </h5>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{job.documentType}</span>
                      <span>•</span>
                      <span>{job.pageCount} pgs ({job.copies} copy)</span>
                      <span>•</span>
                      <span>{job.colorMode}</span>
                      <span>•</span>
                      <span>{job.paperSize}</span>
                    </div>

                    <div className="text-[11px] text-emerald-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>Scheduled Pickup: <strong>{formatDisplayDate(job.pickupDate)}</strong> (8AM-5PM)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => onOpenTrack(job.referenceNumber)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Track Details</span>
                    </button>

                    {job.status === 'Queued' && (
                      <button
                        onClick={() => onCancelJob(job.id)}
                        className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Cancel this print job"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
