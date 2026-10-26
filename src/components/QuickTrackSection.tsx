import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface QuickTrackSectionProps {
  onTrack: (ref: string) => void;
}

export const QuickTrackSection: React.FC<QuickTrackSectionProps> = ({ onTrack }) => {
  const [refInput, setRefInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refInput.trim()) {
      onTrack(refInput.trim());
    }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-400/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>Public Tracking Reference Portal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Already submitted a module?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Type your Tracking Reference Number (e.g. <span className="font-mono text-emerald-300">SKK-2026-4821</span>) to check if your printout is ready for pickup at the 2nd Floor Hub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="SKK-2026-XXXX"
                className="w-full pl-9 pr-3 py-3 text-sm bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-emerald-200/60 border border-emerald-300/40 focus:border-emerald-500 rounded-xl outline-none font-mono transition-all"
              />
              <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={!refInput.trim()}
              className="px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Track Job</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};
