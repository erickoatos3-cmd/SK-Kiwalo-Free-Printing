import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle, 
  Clock, 
  Printer, 
  MapPin, 
  Calendar, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  QrCode, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { PrintJob, AppNotification } from '../types';
import { getPrintJobs, getNotifications, formatDisplayDate, formatTimeAgo } from '../utils/storage';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  initialReference = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialReference);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(() => {
    if (!initialReference) return null;
    const jobs = getPrintJobs();
    return jobs.find(j => j.referenceNumber.toLowerCase() === initialReference.toLowerCase()) || null;
  });
  const [copied, setCopied] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

  // Sync when initialReference changes
  React.useEffect(() => {
    if (initialReference) {
      setSearchTerm(initialReference);
      const jobs = getPrintJobs();
      const match = jobs.find(j => j.referenceNumber.toLowerCase() === initialReference.toLowerCase());
      if (match) setSelectedJob(match);
    }
  }, [initialReference]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTerm.trim().toLowerCase();
    const jobs = getPrintJobs();
    const found = jobs.find(j => 
      j.referenceNumber.toLowerCase() === clean ||
      j.documentTitle.toLowerCase().includes(clean) ||
      j.userName.toLowerCase().includes(clean)
    );
    setSelectedJob(found || null);
  };

  const handleCopyRef = () => {
    if (selectedJob) {
      navigator.clipboard.writeText(selectedJob.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get notifications for this reference number
  const notifications = selectedJob 
    ? getNotifications().filter(n => n.referenceNumber === selectedJob.referenceNumber)
    : [];

  // Timeline steps
  const steps: { key: PrintJob['status']; title: string; desc: string }[] = [
    { key: 'Queued', title: 'Submitted & Queued', desc: 'Received by SK Kiwalo print system' },
    { key: 'Printing', title: 'At Print Desk', desc: 'Staff printing on hub printer' },
    { key: 'Ready for Pickup', title: 'Ready for Pickup', desc: 'SMS alert sent to student' },
    { key: 'Completed', title: 'Claimed / Completed', desc: 'Released to student' },
  ];

  const getStepStatus = (stepKey: PrintJob['status']) => {
    if (!selectedJob) return 'upcoming';
    const order: PrintJob['status'][] = ['Queued', 'Printing', 'Ready for Pickup', 'Completed'];
    const currentIdx = order.indexOf(selectedJob.status);
    const stepIdx = order.indexOf(stepKey);

    if (selectedJob.status === 'Cancelled') return 'cancelled';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5 text-emerald-300" />
            <span>Real-time Print Job Tracking</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Track Reference Number
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Enter your unique SK Kiwalo Tracking Reference Number to see your printing queue status and claim details.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Reference # (e.g. SKK-2026-4821)"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white/10 focus:bg-white text-white focus:text-slate-900 placeholder:text-emerald-200/70 border border-emerald-400/40 rounded-xl outline-none font-mono transition-all"
              />
              <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {selectedJob ? (
            <>
              {/* Job Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-emerald-900">
                      {selectedJob.referenceNumber}
                    </span>
                    <button
                      onClick={handleCopyRef}
                      title="Copy Reference Number"
                      className="p-1 text-emerald-700 hover:bg-emerald-200/60 rounded cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedJob.status === 'Ready for Pickup' 
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : selectedJob.status === 'Printing'
                        ? 'bg-blue-600 text-white'
                        : selectedJob.status === 'Completed'
                        ? 'bg-slate-700 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {selectedJob.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">
                    {selectedJob.documentTitle}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Student: <strong className="text-slate-700">{selectedJob.userName}</strong> • {selectedJob.purok}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setShowSlip(!showSlip)}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showSlip ? 'Hide Claim Slip' : 'Digital Claim Slip'}</span>
                  </button>
                </div>
              </div>

              {/* Digital Claim Slip view */}
              {showSlip && (
                <div className="p-5 border-2 border-dashed border-emerald-400 bg-emerald-50/50 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                        Official Pickup Claim Pass
                      </div>
                      <div className="text-xs text-slate-600">
                        Present this to the SK Desk Officer at 2nd Floor Multi-purpose Hall
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg border border-emerald-300 flex items-center justify-center p-1">
                      <QrCode className="w-full h-full text-emerald-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px]">Reference:</div>
                      <div className="font-mono font-bold text-slate-800">{selectedJob.referenceNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Student / Purok:</div>
                      <div className="font-medium text-slate-800">{selectedJob.userName} ({selectedJob.purok})</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Pages / Copies:</div>
                      <div className="font-medium text-slate-800">{selectedJob.pageCount} pgs • {selectedJob.copies} copy</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Pickup Date:</div>
                      <div className="font-medium text-emerald-700">{formatDisplayDate(selectedJob.pickupDate)}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Location: 2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga Albay (8:00 AM - 5:00 PM)</span>
                  </div>
                </div>
              )}

              {/* Progress Timeline */}
              <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Printing Lifecycle Status
                </h5>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {steps.map((st) => {
                    const status = getStepStatus(st.key);
                    return (
                      <div key={st.key} className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : status === 'current'
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {status === 'completed' ? <Check className="w-3 h-3" /> : '•'}
                        </div>
                        <div>
                          <div className={`text-xs sm:text-sm font-bold ${
                            status === 'current' ? 'text-emerald-800' : 'text-slate-800'
                          }`}>
                            {st.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {st.desc}
                          </div>
                          {st.key === 'Ready for Pickup' && selectedJob.readyAt && (
                            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                              Marked ready: {formatTimeAgo(selectedJob.readyAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                  Print Specifications
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Document Type:</span>
                    <span className="font-medium text-slate-800">{selectedJob.documentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Paper Size:</span>
                    <span className="font-medium text-slate-800">{selectedJob.paperSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Color Mode:</span>
                    <span className="font-medium text-slate-800">{selectedJob.colorMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Finishing:</span>
                    <span className="font-medium text-slate-800">{selectedJob.binding}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Attached File:</span>
                    <span className="font-mono text-slate-800 truncate block">{selectedJob.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submitted:</span>
                    <span className="font-medium text-slate-800">{formatTimeAgo(selectedJob.createdAt)}</span>
                  </div>
                </div>

                {selectedJob.specialInstructions && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Special Instructions:</span>
                    <span className="text-slate-700 italic">"{selectedJob.specialInstructions}"</span>
                  </div>
                )}

                {selectedJob.staffNotes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Staff Note:</span>
                    <span className="text-emerald-800 font-medium">"{selectedJob.staffNotes}"</span>
                  </div>
                )}
              </div>

              {/* SMS Notification History for this Reference */}
              {notifications.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Dispatched SMS & Email Alerts for this Job</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-800 uppercase text-[10px] tracking-wide">
                            {n.type === 'sms' ? '📱 SMS to ' + n.recipient : '✉️ Email to ' + n.recipient}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatTimeAgo(n.timestamp)}</span>
                        </div>
                        <p className="text-slate-700 font-mono text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-200">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pickup Hub Info Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Pickup Instructions:</strong>
                  <div>
                    Location: <strong>2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga Albay</strong>.
                  </div>
                  <div>
                    Office Hours: <strong>Monday to Friday, 8:00 AM - 5:00 PM</strong>. Please present your student ID and this reference number.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">
                {searchTerm ? 'No print job matched this search' : 'Search for your print request'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check that you have typed your Reference Number accurately (e.g. <span className="font-mono text-emerald-700">SKK-2026-4821</span>).
              </p>

              {/* Quick sample buttons */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-400 mb-2">Try one of the existing records:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm('SKK-2026-4821');
                      const jobs = getPrintJobs();
                      setSelectedJob(jobs.find(j => j.referenceNumber === 'SKK-2026-4821') || null);
                    }}
                    className="px-2.5 py-1 text-xs font-mono bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg cursor-pointer"
                  >
                    SKK-2026-4821 (Ready)
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('SKK-2026-7290');
                      const jobs = getPrintJobs();
                      setSelectedJob(jobs.find(j => j.referenceNumber === 'SKK-2026-7290') || null);
                    }}
                    className="px-2.5 py-1 text-xs font-mono bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg cursor-pointer"
                  >
                    SKK-2026-7290 (Printing)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
