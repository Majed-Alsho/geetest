'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, Trash2, CheckCheck, 
  MessageCircle, Heart, Eye, AlertCircle,
  DollarSign, Shield, TrendingUp
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn, formatDistanceToNow } from '@/lib/utils';

const notificationIcons: Record<string, typeof Bell> = {
  listing_approved: Check,
  listing_rejected: X,
  listing_sold: DollarSign,
  new_message: MessageCircle,
  price_drop: TrendingUp,
  watchlist_update: Eye,
  offer_received: DollarSign,
  offer_accepted: Check,
  offer_rejected: X,
  system: AlertCircle,
  announcement: Bell,
  promotion_expired: AlertCircle,
  ticket_reply: MessageCircle,
  security_alert: Shield,
  payment_received: DollarSign,
};

const notificationColors: Record<string, string> = {
  listing_approved: 'text-green-500 bg-green-500/10',
  listing_rejected: 'text-red-500 bg-red-500/10',
  listing_sold: 'text-accent bg-accent/10',
  new_message: 'text-blue-500 bg-blue-500/10',
  price_drop: 'text-amber-500 bg-amber-500/10',
  system: 'text-muted-foreground bg-secondary',
  security_alert: 'text-red-500 bg-red-500/10',
  payment_received: 'text-green-500 bg-green-500/10',
};

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll 
  } = useNotifications();
  const { navigateTo } = useNavigation();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      // Navigate to the action URL
      if (notification.actionUrl.startsWith('/')) {
        // Extract view type from URL
        const viewType = notification.actionUrl.slice(1).split('/')[0];
        navigateTo(viewType as any);
      }
    }
    setIsOpen(false);
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50"
          >
            <GlassPanel className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-secondary rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {recentNotifications.map((notification) => {
                      const Icon = notificationIcons[notification.type] || Bell;
                      const colorClass = notificationColors[notification.type] || 'text-muted-foreground bg-secondary';
                      
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 hover:bg-secondary/50 transition-colors cursor-pointer group",
                            !notification.read && "bg-accent/5"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={cn(
                                  "text-sm font-medium truncate",
                                  !notification.read && "text-foreground"
                                )}>
                                  {notification.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                                </button>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt))}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll notify you when something arrives
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border flex justify-between">
                  <button
                    onClick={() => {
                      navigateTo('profile');
                      setIsOpen(false);
                    }}
                    className="text-xs text-accent hover:text-accent/80"
                  >
                    View all in settings
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
