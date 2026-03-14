'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  AppNotification,
  NotificationInput,
  NotificationPreferences,
  NotificationType,
  NOTIFICATION_TEMPLATES,
} from '@/types/notifications';

// Alias for convenience
type Notification = AppNotification;

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  
  // Actions
  addNotification: (input: NotificationInput) => Notification;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  // Helpers
  getNotificationsByType: (type: NotificationType) => Notification[];
  getRecentNotifications: (count?: number) => Notification[];
  hasUnread: () => boolean;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const NOTIFICATIONS_KEY = 'gee_notifications';
const PREFERENCES_KEY = 'gee_notification_preferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  types: {
    listing_approved: true,
    listing_rejected: true,
    listing_sold: true,
    new_message: true,
    price_drop: true,
    watchlist_update: true,
    offer_received: true,
    offer_accepted: true,
    offer_rejected: true,
    system: true,
    announcement: true,
    promotion_expired: true,
    ticket_reply: true,
    security_alert: true,
    payment_received: true,
  },
  emailDigest: 'daily',
  pushEnabled: true,
  soundEnabled: false,
};

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load data on mount
  useEffect(() => {
    const storedNotifications = getStoredData<Notification[]>(NOTIFICATIONS_KEY, []);
    const storedPreferences = getStoredData<NotificationPreferences>(PREFERENCES_KEY, DEFAULT_PREFERENCES);
    
    // Parse dates
    const parsedNotifications = storedNotifications.map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
    }));
    
    // Filter out expired notifications
    const now = new Date();
    const activeNotifications = parsedNotifications.filter(
      n => !n.expiresAt || new Date(n.expiresAt) > now
    );
    
    setNotifications(activeNotifications);
    setPreferences(storedPreferences);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((input: NotificationInput): Notification => {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current-user', // Would be actual user ID
      type: input.type,
      title: input.title,
      message: input.message,
      priority: input.priority || 'medium',
      read: false,
      createdAt: new Date(),
      actionUrl: input.actionUrl,
      actionLabel: input.actionLabel,
      metadata: input.metadata,
      expiresAt: input.expiresAt,
    };

    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 100); // Keep last 100
      saveData(NOTIFICATIONS_KEY, updated);
      return updated;
    });

    // Show browser notification if enabled
    if (preferences.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, { body: notification.message });
    }

    return notification;
  }, [preferences.pushEnabled]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveData(NOTIFICATIONS_KEY, updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveData(NOTIFICATIONS_KEY, updated);
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      saveData(NOTIFICATIONS_KEY, updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveData(NOTIFICATIONS_KEY, []);
  }, []);

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      saveData(PREFERENCES_KEY, updated);
      return updated;
    });
  }, []);

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getRecentNotifications = useCallback((count: number = 5) => {
    return notifications.slice(0, count);
  }, [notifications]);

  const hasUnread = useCallback(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        updatePreferences,
        getNotificationsByType,
        getRecentNotifications,
        hasUnread,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      preferences: DEFAULT_PREFERENCES,
      addNotification: () => ({ id: '', userId: '', type: 'system' as NotificationType, title: '', message: '', priority: 'medium' as const, read: false, createdAt: new Date() }),
      markAsRead: () => {},
      markAllAsRead: () => {},
      deleteNotification: () => {},
      clearAll: () => {},
      updatePreferences: () => {},
      getNotificationsByType: () => [],
      getRecentNotifications: () => [],
      hasUnread: () => false,
    };
  }
  return context;
}

// Helper to create notification from template
export function createNotificationFromTemplate(
  type: NotificationType,
  variables: Record<string, string | number>
): NotificationInput {
  const template = NOTIFICATION_TEMPLATES[type];
  let message = template.messageTemplate;
  
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  
  return {
    type,
    title: template.title,
    message,
    priority: type === 'security_alert' ? 'urgent' : type === 'listing_sold' ? 'high' : 'medium',
  };
}
