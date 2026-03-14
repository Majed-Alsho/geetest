'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory, TicketMessage } from '@/types/support';

interface SupportContextType {
  tickets: SupportTicket[];
  isLoading: boolean;
  createTicket: (data: {
    subject: string;
    category: TicketCategory;
    message: string;
    priority?: TicketPriority;
    userId: string;
    userEmail: string;
    userName: string;
    clientNumber: string;
  }) => Promise<SupportTicket>;
  addMessage: (ticketId: string, content: string, senderInfo: {
    senderId: string;
    senderName: string;
    senderRole: 'user' | 'admin';
  }) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  assignTicket: (ticketId: string, adminId: string, adminName: string) => void;
  resolveTicket: (ticketId: string, resolution: string) => void;
  getTicketById: (ticketId: string) => SupportTicket | undefined;
  getTicketsByClientNumber: (clientNumber: string) => SupportTicket[];
  deleteTicket: (ticketId: string) => void;
  getStats: () => { total: number; open: number; inProgress: number; resolved: number };
}

const SupportContext = createContext<SupportContextType | null>(null);

const TICKETS_KEY = 'gee_support_tickets';

// Helper to generate unique ID
function generateId(): string {
  const date = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${date}-${random}`.toUpperCase();
}

// Get stored tickets from localStorage
function getStoredTickets(): SupportTicket[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save tickets to localStorage
function saveTickets(tickets: SupportTicket[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Failed to save tickets:', e);
  }
}

// Lazy initializer
function getInitialTickets(): SupportTicket[] {
  if (typeof window === 'undefined') return [];
  return getStoredTickets();
}

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(getInitialTickets);
  const [isLoading, setIsLoading] = useState(false);

  // Persist tickets to localStorage
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  const createTicket = useCallback(async (data: {
    subject: string;
    category: TicketCategory;
    message: string;
    priority?: TicketPriority;
    userId: string;
    userEmail: string;
    userName: string;
    clientNumber: string;
  }): Promise<SupportTicket> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const now = new Date();
    const newTicket: SupportTicket = {
      id: generateId(),
      clientNumber: data.clientNumber,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      subject: data.subject,
      category: data.category,
      priority: data.priority || 'medium',
      status: 'open',
      messages: [{
        id: `MSG-${Date.now()}`,
        senderId: data.userId,
        senderName: data.userName,
        senderRole: 'user',
        content: data.message,
        createdAt: now,
      }],
      createdAt: now,
      updatedAt: now,
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  }, []);

  const addMessage = useCallback(async (ticketId: string, content: string, senderInfo: {
    senderId: string;
    senderName: string;
    senderRole: 'user' | 'admin';
  }): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const message: TicketMessage = {
      id: `MSG-${Date.now()}`,
      senderId: senderInfo.senderId,
      senderName: senderInfo.senderName,
      senderRole: senderInfo.senderRole,
      content,
      createdAt: new Date(),
    };

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, message],
          updatedAt: new Date(),
          status: senderInfo.senderRole === 'admin' ? 'waiting_user' : 'waiting_admin',
        };
      }
      return ticket;
    }));
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status,
          updatedAt: new Date(),
        };
      }
      return ticket;
    }));
  }, []);

  const assignTicket = useCallback((ticketId: string, adminId: string, adminName: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignedTo: adminId,
          assignedToName: adminName,
          status: 'in_progress' as TicketStatus,
          updatedAt: new Date(),
        };
      }
      return ticket;
    }));
  }, []);

  const resolveTicket = useCallback((ticketId: string, resolution: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'resolved' as TicketStatus,
          resolution,
          resolvedAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return ticket;
    }));
  }, []);

  const getTicketById = useCallback((ticketId: string): SupportTicket | undefined => {
    return tickets.find(t => t.id === ticketId);
  }, [tickets]);

  const getTicketsByClientNumber = useCallback((clientNumber: string): SupportTicket[] => {
    return tickets.filter(t => t.clientNumber === clientNumber);
  }, [tickets]);

  const deleteTicket = useCallback((ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  }, []);

  const getStats = useCallback(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress' || t.status === 'waiting_admin').length,
      resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    };
  }, [tickets]);

  return (
    <SupportContext.Provider
      value={{
        tickets,
        isLoading,
        createTicket,
        addMessage,
        updateTicketStatus,
        assignTicket,
        resolveTicket,
        getTicketById,
        getTicketsByClientNumber,
        deleteTicket,
        getStats,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    return {
      tickets: [],
      isLoading: false,
      createTicket: async () => { throw new Error('Not available'); },
      addMessage: async () => {},
      updateTicketStatus: () => {},
      assignTicket: () => {},
      resolveTicket: () => {},
      getTicketById: () => undefined,
      getTicketsByClientNumber: () => [],
      deleteTicket: () => {},
      getStats: () => ({ total: 0, open: 0, inProgress: 0, resolved: 0 }),
    };
  }
  return context;
}
