// Notification System Types
// Note: Using AppNotification name to avoid conflict with browser's built-in Notification type

export type NotificationType = 
  | 'listing_approved'
  | 'listing_rejected'
  | 'listing_sold'
  | 'new_message'
  | 'price_drop'
  | 'watchlist_update'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'system'
  | 'announcement'
  | 'promotion_expired'
  | 'ticket_reply'
  | 'security_alert'
  | 'payment_received';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  relatedId?: string;
}

// Alias for convenience
export type Notification = AppNotification;

export interface NotificationPreferences {
  enabled: boolean;
  types: {
    [key in NotificationType]?: boolean;
  };
  emailDigest: 'none' | 'daily' | 'weekly';
  pushEnabled: boolean;
  soundEnabled: boolean;
}

export interface NotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
  relatedId?: string;
  userId?: string;
}

// Notification Templates
export const NOTIFICATION_TEMPLATES: Record<NotificationType, { title: string; messageTemplate: string }> = {
  listing_approved: {
    title: 'Listing Approved',
    messageTemplate: 'Your listing "{listingTitle}" has been approved.',
  },
  listing_rejected: {
    title: 'Listing Rejected',
    messageTemplate: 'Your listing "{listingTitle}" was rejected.',
  },
  listing_sold: {
    title: 'Listing Sold',
    messageTemplate: 'Your listing "{listingTitle}" has been sold!',
  },
  new_message: {
    title: 'New Message',
    messageTemplate: 'You have a new message.',
  },
  price_drop: {
    title: 'Price Drop',
    messageTemplate: 'A price drop on a listing you watch.',
  },
  watchlist_update: {
    title: 'Watchlist Update',
    messageTemplate: 'An update on your watchlist.',
  },
  offer_received: {
    title: 'Offer Received',
    messageTemplate: 'You received an offer.',
  },
  offer_accepted: {
    title: 'Offer Accepted',
    messageTemplate: 'Your offer was accepted!',
  },
  offer_rejected: {
    title: 'Offer Rejected',
    messageTemplate: 'Your offer was declined.',
  },
  system: {
    title: 'System',
    messageTemplate: '{message}',
  },
  announcement: {
    title: 'Announcement',
    messageTemplate: '{message}',
  },
  promotion_expired: {
    title: 'Promotion Expired',
    messageTemplate: 'Your promotion has ended.',
  },
  ticket_reply: {
    title: 'Ticket Reply',
    messageTemplate: 'Your support ticket has a new reply.',
  },
  security_alert: {
    title: 'Security Alert',
    messageTemplate: '{message}',
  },
  payment_received: {
    title: 'Payment Received',
    messageTemplate: 'Payment has been received.',
  },
};
