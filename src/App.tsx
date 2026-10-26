import React, { useState, useEffect } from 'react';
import { 
  User, 
  PrintJob, 
  AppNotification, 
  JobStatus 
} from './types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getPrintJobs, 
  getNotifications, 
  getDailySlotInfo, 
  getTodayDateString, 
  updateJobStatus, 
  savePrintJob, 
  markNotificationsRead 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroOverview } from './components/HeroOverview';
import { DailyCapacitySection } from './components/DailyCapacitySection';
import { QuickTrackSection } from './components/QuickTrackSection';
import { StudentDashboard } from './components/StudentDashboard';
import { OfficerDeskView } from './components/OfficerDeskView';
import { AuthModal } from './components/AuthModal';
import { PrintSubmissionModal } from './components/PrintSubmissionModal';
import { TrackingModal } from './components/TrackingModal';
import { LearningHubInfoModal } from './components/LearningHubInfoModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Footer } from './components/Footer';
import { 
  CheckCircle2, 
  Smartphone, 
  X, 
  ArrowRight, 
  Printer, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  Users
} from 'lucide-react';

export default function App() {
  const [currentUser, setUser] = useState<User | null>(() => getCurrentUser());
  const [jobs, setJobs] = useState<PrintJob[]>(() => getPrintJobs());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications());
  const [dailySlots, setDailySlots] = useState(() => getDailySlotInfo(getTodayDateString()));

  // Active Modals & Views
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingRef, setTrackingRef] = useState<string>('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isOfficerMode, setIsOfficerMode] = useState(false);

  // Live Toast for SMS alerts
  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

  // Sync state helpers
  const refreshData = () => {
    setJobs(getPrintJobs());
    setNotifications(getNotifications());
    setDailySlots(getDailySlotInfo(getTodayDateString()));
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };

    const handleNotificationSent = (e: CustomEvent<AppNotification>) => {
      refreshData();
      setToastNotification(e.detail);
      setTimeout(() => {
        setToastNotification(null);
      }, 7000);
    };

    window.addEventListener('sk_kiwalo_storage_update', handleStorageUpdate);
    window.addEventListener('sk_kiwalo_notification_sent', handleNotificationSent as EventListener);

    return () => {
      window.removeEventListener('sk_kiwalo_storage_update', handleStorageUpdate);
      window.removeEventListener('sk_kiwalo_notification_sent', handleNotificationSent as EventListener);
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    refreshData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    refreshData();
  };

  const handleTrackReference = (ref: string) => {
    setTrackingRef(ref);
    setTrackingModalOpen(true);
  };

  const handleJobCreated = (newJob: PrintJob) => {
    refreshData();
    setTrackingRef(newJob.referenceNumber);
    setTrackingModalOpen(true);
  };

  const handleUpdateJobStatus = (jobId: string, status: JobStatus, notes?: string) => {
    updateJobStatus(jobId, status, notes);
    refreshData();
  };

  const handleCancelJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to cancel this print job?')) {
      updateJobStatus(jobId, 'Cancelled', 'Cancelled by student.');
      refreshData();
    }
  };

  const handleMarkAllNotificationsRead = () => {
    markNotificationsRead();
    refreshData();
  };

  // Filter user's specific jobs
  const userJobs = currentUser
    ? jobs.filter(j => j.userId === currentUser.id || j.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-300 selection:text-emerald-950">
      
      {/* Toast Alert Popover (Simulated SMS Toast) */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/50 animate-bounce-subtle flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider">
                SMS Notification Sent
              </span>
              <button 
                onClick={() => setToastNotification(null)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-semibold text-white">{toastNotification.title}</div>
            <p className="text-slate-300 text-[11px] leading-tight line-clamp-3 font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
              {toastNotification.message}
            </p>
            {toastNotification.referenceNumber && (
              <button
                onClick={() => {
                  handleTrackReference(toastNotification.referenceNumber!);
                  setToastNotification(null);
                }}
                className="text-emerald-400 font-bold hover:underline text-[11px] pt-1 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Job: {toastNotification.referenceNumber}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onTrackReference={handleTrackReference}
        dailySlots={dailySlots}
        isOfficerMode={isOfficerMode}
        onToggleOfficerMode={() => setIsOfficerMode(!isOfficerMode)}
        unreadCount={unreadCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenLocationHub={() => setLocationModalOpen(true)}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
      />

      {/* If Officer Desk Mode is toggled ON, display the SK Desk Staff queue management */}
      {isOfficerMode && (
        <OfficerDeskView
          jobs={jobs}
          onUpdateStatus={handleUpdateJobStatus}
          onOpenTrack={handleTrackReference}
          onExitOfficerMode={() => setIsOfficerMode(false)}
        />
      )}

      {/* Hero Overview Banner (with green gradient) */}
      <HeroOverview
        dailySlots={dailySlots}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenTrack={() => handleTrackReference(jobs[0]?.referenceNumber || '')}
        onOpenLocation={() => setLocationModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={!!currentUser}
      />

      {/* Visual Daily Capacity & 10 Students Quota Tracker */}
      <DailyCapacitySection
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenTrack={handleTrackReference}
      />

      {/* Quick Tracking Search Section */}
      <QuickTrackSection
        onTrack={handleTrackReference}
      />

      {/* Logged-In Student Dashboard */}
      {currentUser && (
        <StudentDashboard
          currentUser={currentUser}
          userJobs={userJobs}
          onOpenSubmit={() => setSubmitModalOpen(true)}
          onOpenTrack={handleTrackReference}
          onCancelJob={handleCancelJob}
        />
      )}

      {/* Educational Modules & Feature Info Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Empowering Kiwalo Students
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Free Printing Works in 3 Steps
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Zero paper cost, zero ink cost. Built for high school, college, and vocational students of Barangay Kiwalo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Create Account & Upload
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register with your Full Name, Email, Contact Number, and Purok (Purok 1, 2, or 3) with a quick 4-PIN password. Upload your PDF or DOCX module.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-600/20">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Print Desk Processes Job
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your file is assigned a unique Reference Number (e.g. SKK-2026-XXXX). Our youth officers print it cleanly on short, long bond, or A4 paper.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-100 hover:border-emerald-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-green-600/20">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Receive SMS Alert & Pick Up
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get an instant SMS text notification when done. Pick up during hub office hours: Mon-Fri 8:00 AM - 5:00 PM at 2nd Floor, Kiwalo Multi-purpose Hall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenLocation={() => setLocationModalOpen(true)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      <PrintSubmissionModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        currentUser={currentUser}
        onJobCreated={handleJobCreated}
        onRequireAuth={() => {
          setSubmitModalOpen(false);
          handleOpenAuth('register');
        }}
      />

      <TrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        initialReference={trackingRef}
      />

      <LearningHubInfoModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectReference={handleTrackReference}
      />

    </div>
  );
}
