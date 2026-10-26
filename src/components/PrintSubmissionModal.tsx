import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Calendar, 
  Layers, 
  Palette, 
  Copy, 
  Info, 
  CheckCircle, 
  Sparkles,
  AlertTriangle,
  Clock,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, DocumentType, PaperSize, ColorMode, BindingOption, PrintJob } from '../types';
import { 
  getTodayDateString, 
  getDailySlotInfo, 
  generateReferenceNumber, 
  savePrintJob, 
  sendNotification, 
  formatDisplayDate,
  DAILY_CAPACITY_LIMIT
} from '../utils/storage';

interface PrintSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onJobCreated: (job: PrintJob) => void;
  onRequireAuth: () => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'School Module',
  'Research Paper / Thesis',
  'Reviewer / Exam Prep',
  'Assignment / Worksheet',
  'Educational Certificate / Form',
];

const PAPER_SIZES: PaperSize[] = [
  'Short Bond (8.5x11 in)',
  'Long Bond (8.5x13 in)',
  'A4 (8.27x11.69 in)',
];

const COLOR_MODES: ColorMode[] = [
  'Black & White',
  'Colored (Full)',
  'Highlighted / Accent Color',
];

const BINDING_OPTIONS: BindingOption[] = [
  'Stapled (Top Left)',
  'Paper Clip',
  'Loose Sheets',
];

export const PrintSubmissionModal: React.FC<PrintSubmissionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onJobCreated,
  onRequireAuth,
}) => {
  const todayStr = getTodayDateString();

  // Form states
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('School Module');
  const [file, setFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState('');
  const [mockFileSize, setMockFileSize] = useState('');
  const [pageCount, setPageCount] = useState<number>(10);
  const [copies, setCopies] = useState<number>(1);
  const [paperSize, setPaperSize] = useState<PaperSize>('Short Bond (8.5x11 in)');
  const [colorMode, setColorMode] = useState<ColorMode>('Black & White');
  const [binding, setBinding] = useState<BindingOption>('Stapled (Top Left)');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [pickupDate, setPickupDate] = useState<string>(todayStr);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Check capacity for selected pickup date
  const slotInfo = getDailySlotInfo(pickupDate);
  const isFull = slotInfo.remainingSlots <= 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setMockFileName(selected.name);
      const sizeMb = (selected.size / (1024 * 1024)).toFixed(1);
      setMockFileSize(`${sizeMb} MB`);
      if (!documentTitle) {
        setDocumentTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setMockFileName(dropped.name);
      const sizeMb = (dropped.size / (1024 * 1024)).toFixed(1);
      setMockFileSize(`${sizeMb} MB`);
      if (!documentTitle) {
        setDocumentTitle(dropped.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!documentTitle.trim()) {
      setError('Please provide a document title (e.g. Science Module 2).');
      return;
    }

    if (!file && !mockFileName) {
      setError('Please attach your school module, reviewer, or document file.');
      return;
    }

    if (pageCount < 1 || pageCount > 50) {
      setError('Barangay Kiwalo free printing accommodates up to 50 pages per batch.');
      return;
    }

    if (isFull) {
      setError(`Daily quota of ${DAILY_CAPACITY_LIMIT} students reached for ${formatDisplayDate(pickupDate)}. Please select another weekday.`);
      return;
    }

    setIsSubmitting(true);

    const refNumber = generateReferenceNumber();
    const newJob: PrintJob = {
      id: 'job-' + Date.now(),
      referenceNumber: refNumber,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      userContact: currentUser.contactNumber,
      purok: currentUser.purok,
      documentTitle: documentTitle.trim(),
      documentType,
      fileName: mockFileName || 'School_Module_Printout.pdf',
      fileSizeFormatted: mockFileSize || '2.4 MB',
      pageCount,
      copies,
      paperSize,
      colorMode,
      binding,
      specialInstructions: specialInstructions.trim() || undefined,
      pickupDate,
      status: 'Queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePrintJob(newJob);

    // Trigger instant simulated SMS and Email
    sendNotification({
      type: 'sms',
      recipient: currentUser.contactNumber,
      title: 'Print Request Received',
      message: `SK KIWALO: Mabuhay ${currentUser.fullName.split(' ')[0]}! Your document "${newJob.documentTitle}" was queued with Tracking Reference: ${refNumber}. Pick up at SK Kiwalo Learning Hub (2nd Flr Multi-purpose Hall) upon SMS completion alert.`,
      referenceNumber: refNumber,
    });

    sendNotification({
      type: 'email',
      recipient: currentUser.email,
      title: `Confirmed: Free Print Submission [${refNumber}]`,
      message: `Hi ${currentUser.fullName}, your submission has been forwarded to the SK Kiwalo Learning Hub print queue for ${formatDisplayDate(pickupDate)}. Keep your reference ${refNumber} to track real-time progress.`,
      referenceNumber: refNumber,
    });

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    onJobCreated(newJob);
    onClose();
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
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>SK Kiwalo Learning Hub • Free Printing Desk</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Upload School Module or Document
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Fill in your printing preferences. Our desk will process your job and notify you via SMS when ready for pickup.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!currentUser && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Please log in or create a Barangay Kiwalo student account to submit your print request.
                </span>
              </div>
              <button
                type="button"
                onClick={onRequireAuth}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
              >
                Log In / Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Student details recap */}
            {currentUser && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Student:</span>{' '}
                  <strong className="text-slate-900">{currentUser.fullName}</strong>{' '}
                  <span className="text-emerald-700 font-medium">({currentUser.purok})</span>
                </div>
                <div className="text-slate-500">
                  SMS Alert: <span className="font-mono text-slate-800">{currentUser.contactNumber}</span>
                </div>
              </div>
            )}

            {/* Document Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g. Science Quarter 2 Reviewer"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Category *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                >
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach File (PDF, DOCX, PPTX, or Images) *
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all rounded-2xl p-5 text-center cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.pptx,.ppt,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  {mockFileName ? (
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>{mockFileName}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700">{mockFileSize} • Ready for print desk</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">
                        Click to browse or drag & drop school file here
                      </div>
                      <p className="text-[11px] text-slate-500">
                        PDF, Word (.docx), PowerPoint (.pptx), or Scanned Images up to 25MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Print Options: Paper Size, Color Mode, Binding, Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paper Size
                </label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
                >
                  {PAPER_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Color Mode
                </label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value as ColorMode)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
                >
                  {COLOR_MODES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Finishing / Binding
                </label>
                <select
                  value={binding}
                  onChange={(e) => setBinding(e.target.value as BindingOption)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
                >
                  {BINDING_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Number of Pages & Copies */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Document Pages
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">pages</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Copies (Max 2 free)
                </label>
                <select
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
                >
                  <option value={1}>1 Copy (Standard Free)</option>
                  <option value={2}>2 Copies (Group / Partner)</option>
                </select>
              </div>
            </div>

            {/* Daily Capacity & Slot Reservation Date */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Target Pickup Date (Daily 10 Students Quota)</span>
                </label>
                <span className={`text-xs font-bold ${isFull ? 'text-red-600' : 'text-emerald-700'}`}>
                  {slotInfo.remainingSlots} of {slotInfo.totalAllowed} slots available
                </span>
              </div>

              <input
                type="date"
                min={todayStr}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 focus:border-emerald-600 rounded-xl outline-none"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Pickup hours: Mon-Fri 8:00 AM - 5:00 PM @ 2nd Flr Multi-purpose Hall</span>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Instructions for Print Desk (Optional)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please print front and back; or urgent reviewer for midterm exams tomorrow."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isFull || !currentUser}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Print Job & Generate Tracking Ref #</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
