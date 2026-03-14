'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, CheckCheck, Trash2, Settings, 
  Building2, MessageCircle, DollarSign, AlertTriangle,
  Shield, Ticket, TrendingDown, ChevronRight, Clock
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/lib/utils';
import { NotificationType } from '@/types/notifications';
import { Link } from '@/components/Link';

const NOTIFICATION_ICONS: Record<NotificationType, typeof Bell> = {
  listing_approved: Building2,
  listing_rejected: AlertTriangle,
  listing_sold: DollarSign,
  new_message: MessageCircle,
  price_drop: TrendingDown,
  watchlist_update: Building2,
  offer_received: DollarSign,
  offer_accepted: Check,
  offer_rejected: X,
  system: Bell,
  announcement: Bell,
  promotion_expired: Clock,
  ticket_reply: Ticket,
  security_alert: Shield,
  payment_received: DollarSign,
};

const PRIORITY_COLORS = {
  low: 'bg-muted/10 border-muted/20',
  medium: 'bg-secondary/30 border-border/50',
  high: 'bg-accent/5 border-accent/20',
  urgent: 'bg-red-500/10 border-red-500/20',
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md"
          >
            <GlassPanel className="h-full rounded-none border-l border-border flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filters & Actions */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      filter === 'all' ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      filter === 'unread' ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
              </div>
              
              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notification) => {
                      const Icon = NOTIFICATION_ICONS[notification.type];
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-4 border-l-2 transition-colors hover:bg-secondary/30",
                            !notification.read && "border-l-accent bg-accent/5",
                            notification.read && "border-l-transparent",
                            PRIORITY_COLORS[notification.priority]
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                              notification.priority === 'urgent' ? "bg-red-500/10" : "bg-secondary"
                            )}>
                              <Icon className={cn(
                                "w-5 h-5",
                                notification.priority === 'urgent' ? "text-red-500" : "text-muted-foreground"
                              )} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className={cn(
                                  "font-medium",
                                  !notification.read && "text-foreground",
                                  notification.read && "text-muted-foreground"
                                )}>
                                  {notification.title}
                                </h3>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 hover:bg-secondary rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(notification.createdAt)}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs text-accent hover:text-accent/80 transition-colors"
                                    >
                                      Mark as read
                                    </button>
                                  )}
                                  
                                  {notification.actionUrl && (
                                    <Link
                                      to={notification.actionUrl as any}
                                      onClick={onClose}
                                      className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                                    >
                                      {notification.actionLabel || 'View'}
                                      <ChevronRight className="w-3 h-3" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-border">
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Notifications
                  </Button>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Notification Bell Button Component
export function NotificationBell({ onClick }: { onClick: () => void }) {
  const { unreadCount, hasUnread } = useNotifications();
  
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
    >
      <Bell className="w-5 h-5" />
      {hasUnread() && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
      )}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground min-w-[18px] text-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
