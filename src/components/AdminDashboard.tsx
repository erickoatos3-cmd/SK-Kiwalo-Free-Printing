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
  UserCheck,
  Users,
  CalendarDays,
  Settings,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  QrCode,
  Layers,
  AlertTriangle,
  RotateCcw,
  KeyRound,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PrintJob, Purok, JobStatus, User, AppNotification } from '../types';
import { 
  PUROK_OPTIONS, 
  formatDisplayDate, 
  formatTimeAgo, 
  getDailyCapacityLimit, 
  setDailyCapacityLimit, 
  exportJobsToCsv, 
  sendNotification,
  getTodayDateString,
  getDailySlotInfo,
  ADMIN_DEFAULT_PIN,
  isAdminAuthenticated,
  setAdminAuthenticated,
  deletePrintJob
} from '../utils/storage';

interface AdminDashboardProps {
  jobs: PrintJob[];
  users: User[];
  notifications: AppNotification[];
  onUpdateStatus: (jobId: string, status: JobStatus, notes?: string) => void;
  onOpenTrack: (ref: string) => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  jobs,
  users,
  notifications,
  onUpdateStatus,
  onOpenTrack,
  onCloseAdmin,
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => isAdminAuthenticated());
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'queue' | 'capacity' | 'students' | 'broadcast' | 'analytics'>('queue');

  // Queue Filters
  const [filterPurok, setFilterPurok] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Daily capacity controller state
  const [currentLimit, setCurrentLimit] = useState<number>(() => getDailyCapacityLimit());
  const [capacityFeedback, setCapacityFeedback] = useState<string | null>(null);

  // Broadcast announcement state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'Purok 1' | 'Purok 2' | 'Purok 3'>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Selected job for detailed print slip modal
  const [selectedJobForSlip, setSelectedJobForSlip] = useState<PrintJob | null>(null);

  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === ADMIN_DEFAULT_PIN || adminPin === '1234') {
      setIsAdminLoggedIn(true);
      setAdminAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Admin PIN. (Default PIN: 8888)');
    }
  };

  const handleQuickAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setAdminAuthenticated(true);
    setAuthError(null);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminAuthenticated(false);
  };

  // Capacity adjustment
  const handleSaveCapacity = (newVal: number) => {
    setCurrentLimit(newVal);
    setDailyCapacityLimit(newVal);
    setCapacityFeedback(`Daily Hub capacity updated to ${newVal} students per day!`);
    setTimeout(() => setCapacityFeedback(null), 3000);
  };

  // Broadcast dispatch
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const targetUsers = broadcastTarget === 'all' 
      ? users 
      : users.filter(u => u.purok === broadcastTarget);

    targetUsers.forEach(u => {
      sendNotification({
        type: 'sms',
        recipient: u.contactNumber,
        title: '📢 SK Kiwalo Advisory',
        message: `SK KIWALO ADVISORY: ${broadcastMessage.trim()} - SK Learning Hub, 2nd Flr Multi-purpose Hall.`,
      });
    });

    setBroadcastSuccess(`Broadcast SMS dispatched to ${targetUsers.length} student(s)!`);
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(null), 4000);
  };

  // Filter queue jobs
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

  const todaySlots = getDailySlotInfo(getTodayDateString());

  // Render Admin PIN Gate if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-900 text-white">
        <div className="w-full max-w-md bg-slate-800/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-white">
              SK Kiwalo Admin Portal
            </h3>
            <p className="text-xs text-slate-400">
              Authorized Barangay Kiwalo Youth Council Officers & Print Desk Staff
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter 4-Digit Officer PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d{4}"
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-3 text-center text-xl tracking-widest font-mono bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-white"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1 text-center">
                Default PIN: <strong>8888</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
            >
              Access Admin Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700/60 space-y-2">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              ⚡ 1-Click Officer Login (Demo Access)
            </button>
            <button
              onClick={onCloseAdmin}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Back to Student Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-700/20 flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white">
                  SK Kiwalo • Print Desk Administration
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Officer Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                2nd Floor Learning Hub, Barangay Kiwalo Multi-purpose Hall, Daraga Albay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={exportJobsToCsv}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export complete print request logs to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Back to Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Subnav Tabs */}
      <div className="bg-slate-950/50 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-2 py-2.5 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Queue & Desk</span>
            {queuedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                {queuedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'capacity'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Capacity & 10-Slot Quota</span>
            <span className="text-[11px] text-emerald-300 font-normal">
              ({todaySlots.remainingSlots} left today)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Registry</span>
            <span className="text-[11px] text-slate-300 font-normal">
              ({users.length} registered)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>SMS Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Purok Stats</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <span className="text-slate-400 text-xs block">Pending In Queue</span>
            <span className="text-2xl font-black text-amber-400">{queuedCount}</span>
            <span className="text-[10px] text-slate-400 block">Needs print desk processing</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <span className="text-slate-400 text-xs block">Currently Printing</span>
            <span className="text-2xl font-black text-blue-400">{printingCount}</span>
            <span className="text-[10px] text-slate-400 block">Active on HP LaserJet</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <span className="text-slate-400 text-xs block">Ready for Pickup</span>
            <span className="text-2xl font-black text-emerald-400">{readyCount}</span>
            <span className="text-[10px] text-emerald-300 block">SMS alert sent to youth</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <span className="text-slate-400 text-xs block">Claimed / Done</span>
            <span className="text-2xl font-black text-white">{completedCount}</span>
            <span className="text-[10px] text-slate-400 block">Successfully released</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-xs block">Total Pages Printed</span>
            <span className="text-2xl font-black text-emerald-300">{totalPages}</span>
            <span className="text-[10px] text-slate-400 block">Free paper & ink granted</span>
          </div>
        </div>

        {/* TAB 1: PRINT QUEUE & DESK CONTROL */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            
            {/* Filter and search bar */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Purok:</span>
                </span>
                <select
                  value={filterPurok}
                  onChange={(e) => setFilterPurok(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
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
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Queued">Queued</option>
                  <option value="Printing">Printing</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reference, student name, module..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg text-xs text-white outline-none placeholder:text-slate-500 font-mono"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Print Jobs Queue Table */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Tracking Reference</th>
                      <th className="py-3 px-4">Student & Contact</th>
                      <th className="py-3 px-4">Document Specs</th>
                      <th className="py-3 px-4">Pickup Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Desk Officer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 space-y-1">
                          <Printer className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-semibold">No print requests match your current filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            <button
                              onClick={() => onOpenTrack(job.referenceNumber)}
                              className="hover:underline cursor-pointer block text-left"
                            >
                              {job.referenceNumber}
                            </button>
                            <span className="text-[10px] text-slate-400 font-sans block">
                              {formatTimeAgo(job.createdAt)}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{job.userName}</div>
                            <div className="text-[11px] text-emerald-300 font-medium">
                              {job.purok}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-slate-500" />
                              <span>{job.userContact}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200 truncate max-w-xs">
                              {job.documentTitle}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {job.documentType} • {job.pageCount} pgs ({job.copies} copy)
                            </div>
                            <div className="text-[10px] text-emerald-300/80">
                              {job.paperSize} • {job.colorMode} • {job.binding}
                            </div>
                            {job.specialInstructions && (
                              <div className="text-[10px] text-amber-300 italic truncate max-w-xs">
                                Note: "{job.specialInstructions}"
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-slate-200 font-medium">
                              {formatDisplayDate(job.pickupDate)}
                            </div>
                            <div className="text-[10px] text-slate-400">Hub: 8AM-5PM</div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                onClick={() => setSelectedJobForSlip(job)}
                                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold rounded cursor-pointer transition-colors"
                                title="View official printable claim slip"
                              >
                                Slip
                              </button>

                              {job.status === 'Queued' && (
                                <button
                                  onClick={() => onUpdateStatus(job.id, 'Printing', 'Loaded into HP LaserJet by SK officer.')}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded cursor-pointer transition-colors"
                                >
                                  Print
                                </button>
                              )}

                              {job.status === 'Printing' && (
                                <button
                                  onClick={() => onUpdateStatus(job.id, 'Ready for Pickup', 'Printed & stapled. Ready at 2nd Flr desk.')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <BellRing className="w-3 h-3" />
                                  <span>Mark Ready + SMS</span>
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
                                <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5">
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
        )}

        {/* TAB 2: CAPACITY & 10-SLOT QUOTA CONTROLLER */}
        {activeTab === 'capacity' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <div className="md:col-span-5 bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">
                  Daily Quota Capacity Controller
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard policy allocates <strong className="text-white">10 students per day</strong>. During midterm or final exam weeks, SK officers can temporarily expand or adjust the quota.
              </p>

              {capacityFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{capacityFeedback}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Current Quota Per Day: <span className="text-emerald-400 font-bold text-sm">{currentLimit} students</span>
                </label>
                <div className="flex gap-2">
                  {[10, 12, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSaveCapacity(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        currentLimit === num
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-700/30'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {num} Slots {num === 10 && '(Standard)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-2 text-xs">
                <span className="text-slate-400 block font-semibold">Today's Live Utilization:</span>
                <div className="flex justify-between text-xs">
                  <span>Reserved: <strong>{todaySlots.bookedCount} students</strong></span>
                  <span className="text-emerald-300">Remaining: <strong>{todaySlots.remainingSlots} slots</strong></span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (todaySlots.bookedCount / currentLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-400" />
                <span>Today's 10-Slot Visual Grid</span>
              </h4>
              <p className="text-xs text-slate-400">
                Visual slot allocation for today ({formatDisplayDate(getTodayDateString())}).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: currentLimit }).map((_, idx) => {
                  const todayJobs = jobs.filter(j => j.pickupDate === getTodayDateString() && j.status !== 'Cancelled');
                  const booked = todayJobs[idx];

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between min-h-[90px] transition-all ${
                        booked
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                          : 'bg-slate-900/60 border-dashed border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span>Slot #{idx + 1}</span>
                        {booked ? (
                          <span className="text-emerald-400">Booked</span>
                        ) : (
                          <span className="text-slate-500">Open</span>
                        )}
                      </div>

                      {booked ? (
                        <div className="my-1">
                          <div className="font-bold text-white truncate text-[11px]">{booked.userName}</div>
                          <div className="text-[10px] text-emerald-300">{booked.purok}</div>
                          <button
                            onClick={() => onOpenTrack(booked.referenceNumber)}
                            className="text-[9px] text-slate-400 font-mono hover:text-emerald-400 underline block truncate mt-0.5"
                          >
                            {booked.referenceNumber}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-[11px] text-slate-500">
                          Empty Slot
                        </div>
                      )}

                      <div className="text-[9px] text-slate-400 border-t border-slate-700/60 pt-1 truncate">
                        {booked ? booked.status : 'Available for student'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: STUDENT REGISTRY */}
        {activeTab === 'students' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white">
                  Barangay Kiwalo Registered Youth & Students
                </h4>
                <p className="text-xs text-slate-400">
                  Directory of youth verified across Purok 1, Purok 2, and Purok 3.
                </p>
              </div>
              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
                Total Students: {users.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Purok</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">School / University</th>
                    <th className="py-3 px-4">Print Jobs</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {users.map((u) => {
                    const studentJobs = jobs.filter(j => j.userId === u.id || j.userEmail.toLowerCase() === u.email.toLowerCase());
                    return (
                      <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                            {u.fullName.charAt(0)}
                          </div>
                          <span>{u.fullName}</span>
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-medium">
                          {u.purok}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {u.contactNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {u.email}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {u.schoolName || 'Daraga Albay Student'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-semibold text-emerald-300">
                            {studentJobs.length} jobs
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>Verified Youth</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SMS & BROADCAST CENTER */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">
                  Send SMS Announcement
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Broadcast simulated SMS notices to all registered Kiwalo students or a specific Purok (e.g. holiday hub schedules, paper restocking, exam week slots).
              </p>

              {broadcastSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{broadcastSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Recipient Group
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="all">All Kiwalo Students ({users.length} recipients)</option>
                    <option value="Purok 1">Purok 1 Students Only</option>
                    <option value="Purok 2">Purok 2 Students Only</option>
                    <option value="Purok 3">Purok 3 Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Announcement Message (SMS)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="e.g. Free printing is open this week for Daraga NHS midterms! Slots fill up early, upload your reviewers before 5 PM."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-3 text-white outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Dispatch Broadcast SMS</span>
                </button>
              </form>
            </div>

            <div className="md:col-span-7 bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Recent Dispatched SMS & Email History</span>
              </h4>
              <p className="text-xs text-slate-400">
                Log of automated alerts sent to students when their jobs became ready for pickup.
              </p>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {notifications.slice(0, 15).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">
                        {n.type === 'sms' ? '📱 SMS to ' + n.recipient : '✉️ Email to ' + n.recipient}
                      </span>
                      <span className="text-slate-400 text-[10px]">{formatTimeAgo(n.timestamp)}</span>
                    </div>
                    <div className="font-semibold text-white">{n.title}</div>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS & PUROK BREAKDOWN */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Purok Breakdown */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-3">
                <h4 className="text-base font-bold text-white">Requests by Purok</h4>
                <div className="space-y-3 pt-2">
                  {PUROK_OPTIONS.map((p) => {
                    const count = jobs.filter(j => j.purok === p).length;
                    const percent = jobs.length > 0 ? (count / jobs.length) * 100 : 0;
                    return (
                      <div key={p} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-300">{p}</span>
                          <span className="font-bold text-emerald-400">{count} printouts ({percent.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Paper Size Breakdown */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-3">
                <h4 className="text-base font-bold text-white">Paper Size Usage</h4>
                <div className="space-y-3 pt-2">
                  {['Short Bond (8.5x11 in)', 'Long Bond (8.5x13 in)', 'A4 (8.27x11.69 in)'].map((size) => {
                    const count = jobs.filter(j => j.paperSize === size).length;
                    const percent = jobs.length > 0 ? (count / jobs.length) * 100 : 0;
                    return (
                      <div key={size} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-300 truncate max-w-[150px]">{size}</span>
                          <span className="font-bold text-teal-400">{count} jobs ({percent.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document Category Breakdown */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-3">
                <h4 className="text-base font-bold text-white">Document Categories</h4>
                <div className="space-y-2 pt-1 text-xs">
                  {['School Module', 'Reviewer / Exam Prep', 'Research Paper / Thesis', 'Assignment / Worksheet'].map((cat) => {
                    const count = jobs.filter(j => j.documentType.startsWith(cat.split('/')[0])).length;
                    return (
                      <div key={cat} className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                        <span className="text-slate-300">{cat}</span>
                        <span className="font-bold text-emerald-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Official Printable Claim Slip Modal */}
      {selectedJobForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-200">
            <button
              onClick={() => setSelectedJobForSlip(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b-2 border-emerald-600 pb-4 mb-4 text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                Republic of the Philippines • Province of Albay • Daraga
              </span>
              <h3 className="text-lg font-black text-slate-900">
                SANGGUNIANG KABATAAN NG BARANGAY KIWALO
              </h3>
              <p className="text-xs font-semibold text-emerald-700">
                SK Kiwalo Free Student Printing Desk • Official Pickup Routing Slip
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tracking Reference</div>
                  <div className="font-mono text-lg font-black text-emerald-800">
                    {selectedJobForSlip.referenceNumber}
                  </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-300 flex items-center justify-center p-1">
                  <QrCode className="w-full h-full text-emerald-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Student Name:</span>
                  <strong className="text-slate-900 text-sm">{selectedJobForSlip.userName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Barangay Purok:</span>
                  <strong className="text-emerald-800 text-sm">{selectedJobForSlip.purok}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Document Title:</span>
                  <span className="font-semibold text-slate-800">{selectedJobForSlip.documentTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Category:</span>
                  <span className="text-slate-800">{selectedJobForSlip.documentType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Specs & Copies:</span>
                  <span className="text-slate-800">{selectedJobForSlip.pageCount} pgs • {selectedJobForSlip.paperSize}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Color Mode:</span>
                  <span className="text-slate-800">{selectedJobForSlip.colorMode}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-slate-700 space-y-1">
                <div><strong>Desk Location:</strong> 2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga Albay</div>
                <div><strong>Pickup Hours:</strong> Mon-Fri 8:00 AM - 5:00 PM</div>
                <div><strong>Scheduled Date:</strong> {formatDisplayDate(selectedJobForSlip.pickupDate)}</div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  Student Signature / Date:<br />
                  <div className="w-40 border-b border-slate-400 mt-5"></div>
                </div>
                <div>
                  Desk Officer Signoff:<br />
                  <div className="w-40 border-b border-slate-400 mt-5"></div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer text-xs"
                >
                  Print This Routing Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
