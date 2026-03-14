// Support Ticket Types

export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'waiting_admin' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'account' | 'subscription' | 'technical' | 'billing' | 'listing' | 'other';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  content: string;
  createdAt: Date;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  clientNumber: string; // Client number of the user who created the ticket
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string; // Admin ID if assigned
  assignedToName?: string; // Admin name
  resolvedAt?: Date;
  resolution?: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  averageResponseTime: number; // in hours
}

// Pre-defined responses for quick replies
export const QUICK_REPLIES = [
  { label: 'Acknowledge', text: 'Thank you for reaching out. We have received your request and will look into it shortly.' },
  { label: 'Need More Info', text: 'We need some additional information to assist you. Could you please provide more details about your issue?' },
  { label: 'Account Verified', text: 'Your account has been verified. You should now have full access to all features.' },
  { label: 'Issue Resolved', text: 'Your issue has been resolved. Please let us know if you need any further assistance.' },
  { label: 'Escalated', text: 'Your case has been escalated to our senior support team. You will receive an update within 24-48 hours.' },
];
