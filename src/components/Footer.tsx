import React from 'react';
import { Printer, MapPin, Clock, Phone, Heart, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onOpenLocation: () => void;
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLocation, onOpenSubmit }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <Printer className="w-5 h-5 text-emerald-100" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                SK Kiwalo Free Printing Initiative
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A flagship youth empowerment program of the Sangguniang Kabataan of Barangay Kiwalo, Daraga, Albay. Providing free high-speed printing of school modules, thesis papers, reviewers, and learning resources to elevate educational success.
            </p>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-medium text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Serving Students from Purok 1, Purok 2, and Purok 3</span>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Learning Hub Location
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>2nd Floor, Barangay Kiwalo Multi-purpose Hall, Daraga, Albay</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Monday to Friday: 8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>SK Help Desk: (052) 892-4110 / 0917-849-2041</span>
              </div>
            </div>
          </div>

          {/* Quick links & policy */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Student Information
            </h5>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={onOpenSubmit}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Upload School Module
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLocation}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Daily 10 Students Quota Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenLocation}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Hub Pickup Requirements
                </button>
              </li>
              <li>
                <span className="text-slate-500">Barangay Kiwalo Youth Development Council</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Sangguniang Kabataan ng Barangay Kiwalo. Daraga, Albay. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for the Filipino Youth of Kiwalo</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
