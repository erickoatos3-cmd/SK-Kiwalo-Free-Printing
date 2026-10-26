import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Check, 
  AlertCircle, 
  Sparkles,
  School,
  KeyRound
} from 'lucide-react';
import { User, Purok } from '../types';
import { PUROK_OPTIONS, getUsers, saveUser, setCurrentUser } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPurok, setRegPurok] = useState<Purok>('Purok 1');
  const [regPin, setRegPin] = useState('');
  const [regSchool, setRegSchool] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setError('No student account found with this email. Please create an account.');
      return;
    }

    if (user.pin !== loginPin) {
      setError('Incorrect 4-PIN password. Please try again.');
      return;
    }

    setCurrentUser(user);
    onSuccess(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please enter a valid Email Address.');
      return;
    }
    if (!regContact.trim() || regContact.length < 10) {
      setError('Please enter a valid Contact Number (e.g. 0917 123 4567).');
      return;
    }
    if (!/^\d{4}$/.test(regPin)) {
      setError('Password must be a 4-digit numeric PIN (e.g., 1234).');
      return;
    }

    const users = getUsers();
    const existing = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      contactNumber: regContact.trim(),
      purok: regPurok,
      pin: regPin,
      schoolName: regSchool.trim() || 'Daraga Albay Student',
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  // Demo auto-filler helper
  const handleDemoLogin = (purokChoice: 'Purok 1' | 'Purok 2' | 'Purok 3') => {
    const users = getUsers();
    const sample = users.find(u => u.purok === purokChoice) || users[0];
    if (sample) {
      setLoginEmail(sample.email);
      setLoginPin(sample.pin);
      setCurrentUser(sample);
      onSuccess(sample);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden my-8">
        
        {/* Modal Header with Green Gradient */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-600/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Barangay Kiwalo Youth Portal</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Student Portal Login' : 'Create Student Free Printing Account'}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            {mode === 'login'
              ? 'Access your print jobs, tracking history, and submit new modules.'
              : 'Create your account once to verify eligibility, submit modules online, and track your print jobs for future school semesters.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-emerald-950/40 p-1 rounded-xl mt-4 border border-emerald-600/40">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-emerald-500 text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-500 text-emerald-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Create Account (New Student)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    2. Password (4-PIN)
                  </label>
                  <span className="text-[11px] text-slate-400">4-digit code</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d{4}"
                    required
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none transition-all text-center text-lg"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer mt-2"
              >
                Log In to Student Portal
              </button>

              {/* Quick demo students for easy grading/review */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium mb-2 text-center">
                  Or test instantly with a demo Kiwalo student:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Purok 1')}
                    className="py-1 px-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer text-center"
                  >
                    Samantha (P1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Purok 2')}
                    className="py-1 px-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer text-center"
                  >
                    Joshua (P2)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('Purok 3')}
                    className="py-1 px-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer text-center"
                  >
                    Alyssa (P3)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form: 1. Full Name, 2. Email, 3. Contact Number, 4. Purok (3 options), 5. Password (4-PIN) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="juan.delacruz@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Contact Number * (for SMS pickup alerts)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    placeholder="0917-123-4567"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. Purok * (Select your Barangay Kiwalo zone)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PUROK_OPTIONS.map((p) => {
                    const isSelected = regPurok === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setRegPurok(p)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{p}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Valid Barangay Kiwalo resident youth in Purok 1, Purok 2, or Purok 3.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School / University (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="e.g. Bicol University, Daraga NHS, Kiwalo HS"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                  />
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    5. Password (4-PIN) *
                  </label>
                  <span className="text-[10px] text-slate-400">4 digits used for future logins</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d{4}"
                    required
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 2026"
                    className="w-full pl-9 pr-3 py-2 text-center text-base tracking-widest font-mono bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl outline-none"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer mt-2"
              >
                Create Account & Get Free Printing
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
