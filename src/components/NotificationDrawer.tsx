import React from 'react';
import { 
  X, 
  Bell, 
  Smartphone, 
  Mail, 
  CheckCheck, 
  ExternalLink,
  MessageSquare,
  Clock
} from 'lucide-react';
import { AppNotification } from '../types';
import { formatTimeAgo } from '../utils/storage';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectReference: (ref: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectReference,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-emerald-100">
        
        {/* Drawer Header with Green Gradient */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Bell className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SMS & Email Alerts
              </h3>
              <p className="text-[11px] text-emerald-200">
                Live simulated student notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No alerts received yet</p>
              <p className="text-xs text-slate-400">
                When you submit a print request or when staff marks it ready, you'll receive simulated SMS & Email messages here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                  n.read
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    {n.type === 'sms' ? (
                      <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[10px]">
                        <Smartphone className="w-3 h-3 text-emerald-700" />
                        SMS ({n.recipient})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded text-[10px]">
                        <Mail className="w-3 h-3 text-teal-700" />
                        EMAIL ({n.recipient})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(n.timestamp)}
                  </span>
                </div>

                <div className="font-semibold text-slate-800">
                  {n.title}
                </div>

                <p className="font-mono text-[11px] leading-relaxed bg-white/90 p-2.5 rounded-lg border border-slate-200/80 text-slate-700 whitespace-pre-wrap">
                  {n.message}
                </p>

                {n.referenceNumber && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectReference(n.referenceNumber!);
                        onClose();
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Track {n.referenceNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          SK Kiwalo Learning Hub • 2nd Flr Multi-purpose Hall, Daraga Albay
        </div>

      </div>
    </div>
  );
};
