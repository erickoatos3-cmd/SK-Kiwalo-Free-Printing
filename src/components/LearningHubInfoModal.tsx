import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Printer, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

interface LearningHubInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: () => void;
}

export const LearningHubInfoModal: React.FC<LearningHubInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenSubmit,
}) => {
  if (!isOpen) return null;

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
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>Barangay Kiwalo, Daraga Albay</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            SK Kiwalo Learning Hub & Print Desk
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Official guidelines, pickup location, operating schedule, and printing policies.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Location & Schedule Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Physical Location</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga, Albay.
              </p>
              <span className="text-[11px] text-emerald-700 block">
                Directly accessible via Kiwalo Main Road; look for the SK Youth Desk banner.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-900 font-bold">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Office & Pickup Hours</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                Monday to Friday: 8:00 AM - 5:00 PM
              </p>
              <span className="text-[11px] text-teal-700 block">
                Closed during weekends & official public holidays.
              </span>
            </div>
          </div>

          {/* Core Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free Printing Guidelines & Eligibility</span>
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">10 Students Per Day Quota:</strong>
                  <div className="text-slate-600 text-xs">
                    To manage paper and printer ink sustainably, our print desk accepts up to 10 youth/student reservations per business day.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Allowed Educational Documents:</strong>
                  <div className="text-slate-600 text-xs">
                    School modules, research papers, thesis drafts, reviewers, exam prep sheets, homework worksheets, and DepEd/CHED forms. (Commercial printing is not permitted).
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Instant SMS & Email Notifications:</strong>
                  <div className="text-slate-600 text-xs">
                    Once our SK desk officer finishes your print job, an SMS notification is dispatched immediately to your registered Philippine mobile number.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">What to Bring During Pickup:</strong>
                  <div className="text-slate-600 text-xs">
                    Please present your student ID or youth identification along with your unique <span className="font-mono font-semibold text-emerald-800">SKK-2026-XXXX</span> tracking reference number or digital claim pass.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Frequently Asked Questions</span>
            </div>
            <div className="space-y-1.5 text-slate-700">
              <p>
                <strong>Q: How much does it cost?</strong><br />
                A: 100% Free! This initiative is fully funded and sponsored by the Sangguniang Kabataan of Barangay Kiwalo to support our local students.
              </p>
              <p>
                <strong>Q: Can students from all puroks join?</strong><br />
                A: Yes! Youth residing in Purok 1, Purok 2, and Purok 3 are all welcome.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSubmit();
              }}
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-xs cursor-pointer"
            >
              Submit School Module Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
