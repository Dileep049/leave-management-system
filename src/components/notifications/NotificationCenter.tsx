import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Trash2, Calendar, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDateTimeString } from '../../utils/dateUtils';

export const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useData();
  const { currentUser, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Filter notifications relevant to current user role or ID
  const userNotifs = notifications.filter((n) => {
    if (n.recipientUserId && currentUser && n.recipientUserId === currentUser.id) return true;
    if (n.recipientRole && n.recipientRole === role) return true;
    return false;
  });

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-white text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {userNotifs.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
              {userNotifs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No new notifications.
                </div>
              ) : (
                userNotifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-4 transition-colors cursor-pointer ${
                      n.read ? 'bg-slate-900/40 opacity-70' : 'bg-indigo-950/20 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                        {n.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {formatDateTimeString(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
