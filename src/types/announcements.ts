// Platform Announcements Types

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'critical';
export type AnnouncementStatus = 'draft' | 'published' | 'scheduled' | 'expired';
export type AnnouncementType = 'info' | 'warning' | 'success' | 'maintenance';

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  scheduledAt?: Date;
  targetRoles?: ('user' | 'admin' | 'superadmin' | 'owner')[];
  targetUserIds?: string[];
  isDismissible: boolean;
  showAsBanner: boolean;
  showAsModal?: boolean;
  linkUrl?: string;
  linkText?: string;
  views: number;
  dismissals: number;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  scheduledAt?: Date;
  expiresAt?: Date;
  targetRoles?: ('user' | 'admin' | 'superadmin' | 'owner')[];
  isDismissible: boolean;
  showAsBanner: boolean;
  showAsModal?: boolean;
  linkUrl?: string;
  linkText?: string;
}

// Configuration
export const ANNOUNCEMENT_TYPE_CONFIG: Record<AnnouncementType, { color: string; icon: string; label: string }> = {
  info: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: 'Info', label: 'Information' },
  warning: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: 'AlertTriangle', label: 'Warning' },
  success: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: 'CheckCircle', label: 'Success' },
  maintenance: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: 'Wrench', label: 'Maintenance' },
};

export const ANNOUNCEMENT_PRIORITY_CONFIG: Record<AnnouncementPriority, { color: string; label: string }> = {
  low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
  medium: { color: 'bg-blue-500/10 text-blue-500', label: 'Medium' },
  high: { color: 'bg-amber-500/10 text-amber-500', label: 'High' },
  critical: { color: 'bg-red-500/10 text-red-500', label: 'Critical' },
};
