import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';

import { Button } from '../components/common/Button';
import {
  Bell,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  CheckCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useFindIt();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <ArrowLeftRight className="w-5 h-5 text-[#174B3A]" />;
      case 'claim':
        return <ShieldCheck className="w-5 h-5 text-[#9E6B02]" />;
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-[#1B5E20]" />;
      default:
        return <Info className="w-5 h-5 text-[#72766F]" />;
    }
  };

  const handleNotificationClick = (notifId: string, relatedId?: string) => {
    markNotificationRead(notifId);
    if (relatedId) {
      navigate(`/item/${relatedId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#242923]">Notifications</h1>
          <p className="text-xs sm:text-sm text-[#72766F] mt-0.5">
            Real-time updates regarding match alerts, claims, and status changes.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E5E2D9] pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#174B3A] text-white'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#174B3A] text-white'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notification List */}
      {filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id, notif.relatedReportId)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-[#FFFEFA] border-[#E5E2D9] text-[#72766F]'
                  : 'bg-[#FAF8F2] border-[#174B3A]/30 shadow-xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  notif.read
                    ? 'bg-[#F2EFE7] border-[#E5E2D9]'
                    : 'bg-[#EBF2ED] border-[#174B3A]/20'
                }`}
              >
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-sm font-semibold leading-snug ${
                      notif.read ? 'text-[#242923]' : 'text-[#174B3A] font-bold'
                    }`}
                  >
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#174B3A] shrink-0" />
                  )}
                </div>

                <p className="text-xs text-[#72766F] leading-relaxed">{notif.message}</p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#9CA099]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {notif.relatedReportId && (
                    <span className="text-[#174B3A] font-medium flex items-center gap-0.5">
                      View details <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-[#9CA099] mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-base text-[#242923]">No notifications</h3>
          <p className="text-xs text-[#72766F]">
            {filter === 'unread'
              ? 'You have caught up with all your notifications.'
              : 'You do not have any notifications at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};
