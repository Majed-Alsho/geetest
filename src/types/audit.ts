// Audit Log Types

export type AuditAction = 
  | 'user.login'
  | 'user.logout'
  | 'user.register'
  | 'user.profile_update'
  | 'user.password_change'
  | 'user.2fa_enable'
  | 'user.2fa_disable'
  | 'listing.create'
  | 'listing.update'
  | 'listing.delete'
  | 'listing.approve'
  | 'listing.reject'
  | 'listing.feature'
  | 'listing.promote'
  | 'offer.create'
  | 'offer.accept'
  | 'offer.reject'
  | 'message.send'
  | 'ticket.create'
  | 'ticket.reply'
  | 'ticket.close'
  | 'admin.user_ban'
  | 'admin.user_unban'
  | 'admin.bulk_action'
  | 'admin.settings_change'
  | 'payment.process'
  | 'payment.refund'
  | 'data.export'
  | 'data.delete';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: AuditAction;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  target?: {
    type: 'user' | 'listing' | 'offer' | 'ticket' | 'payment' | 'system';
    id: string;
    name?: string;
  };
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: AuditSeverity;
  metadata?: {
    before?: any;
    after?: any;
    reason?: string;
  };
}

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  actions?: AuditAction[];
  actors?: string[];
  targets?: string[];
  severity?: AuditSeverity[];
  searchQuery?: string;
}

export interface AuditStats {
  totalEvents: number;
  eventsByAction: Record<string, number>;
  eventsBySeverity: Record<AuditSeverity, number>;
  recentActivity: {
    timestamp: Date;
    count: number;
  }[];
  topActors: {
    actorId: string;
    actorName: string;
    eventCount: number;
  }[];
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  'user.login': 'User Login',
  'user.logout': 'User Logout',
  'user.register': 'User Registration',
  'user.profile_update': 'Profile Update',
  'user.password_change': 'Password Change',
  'user.2fa_enable': '2FA Enabled',
  'user.2fa_disable': '2FA Disabled',
  'listing.create': 'Listing Created',
  'listing.update': 'Listing Updated',
  'listing.delete': 'Listing Deleted',
  'listing.approve': 'Listing Approved',
  'listing.reject': 'Listing Rejected',
  'listing.feature': 'Listing Featured',
  'listing.promote': 'Listing Promoted',
  'offer.create': 'Offer Created',
  'offer.accept': 'Offer Accepted',
  'offer.reject': 'Offer Rejected',
  'message.send': 'Message Sent',
  'ticket.create': 'Ticket Created',
  'ticket.reply': 'Ticket Reply',
  'ticket.close': 'Ticket Closed',
  'admin.user_ban': 'User Banned',
  'admin.user_unban': 'User Unbanned',
  'admin.bulk_action': 'Bulk Action',
  'admin.settings_change': 'Settings Changed',
  'payment.process': 'Payment Processed',
  'payment.refund': 'Payment Refunded',
  'data.export': 'Data Exported',
  'data.delete': 'Data Deleted',
};
