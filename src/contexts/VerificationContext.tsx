'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  VerificationRequest,
  VerificationStatus,
  VerificationDocumentType,
  VerificationDocument,
  DocumentUploadInput,
  VERIFICATION_STATUS_CONFIG,
} from '@/types/verification';

interface VerificationContextType {
  requests: VerificationRequest[];
  isLoading: boolean;
  
  // Actions
  submitVerification: (listingId: string, listingTitle: string, userId: string, userName: string, userEmail: string, notes?: string) => VerificationRequest;
  uploadDocument: (requestId: string, document: DocumentUploadInput) => void;
  removeDocument: (requestId: string, documentId: string) => void;
  approveVerification: (requestId: string, adminNotes?: string) => void;
  rejectVerification: (requestId: string, reason: string, adminNotes?: string) => void;
  deleteRequest: (requestId: string) => void;
  
  // Queries
  getRequestById: (requestId: string) => VerificationRequest | undefined;
  getRequestsByListing: (listingId: string) => VerificationRequest[];
  getRequestsByUser: (userId: string) => VerificationRequest[];
  getRequestsByStatus: (status: VerificationStatus) => VerificationRequest[];
  getPendingRequests: () => VerificationRequest[];
  getVerifiedListings: () => string[];
  isListingVerified: (listingId: string) => boolean;
  getStats: () => { total: number; pending: number; approved: number; rejected: number };
}

const VerificationContext = createContext<VerificationContextType | null>(null);

const VERIFICATIONS_KEY = 'gee_verifications';

// Helper to generate unique ID
function generateId(): string {
  return `ver-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

// Get stored verifications from localStorage
function getStoredVerifications(): VerificationRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(VERIFICATIONS_KEY);
    const requests = data ? JSON.parse(data) : [];
    // Deserialize dates
    return requests.map((r: VerificationRequest) => ({
      ...r,
      submittedAt: new Date(r.submittedAt),
      reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : undefined,
      documents: r.documents.map((d: VerificationDocument) => ({
        ...d,
        uploadedAt: new Date(d.uploadedAt),
      })),
    }));
  } catch {
    return [];
  }
}

// Save verifications to localStorage
function saveVerifications(requests: VerificationRequest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save verifications:', e);
  }
}

// Lazy initializer for useState
function getInitialVerifications(): VerificationRequest[] {
  if (typeof window === 'undefined') return [];
  return getStoredVerifications();
}

// Generate demo verification requests
function generateDemoRequests(): VerificationRequest[] {
  const listings = [
    { id: 'listing-1', title: 'E-commerce Fashion Store' },
    { id: 'listing-2', title: 'SaaS Analytics Platform' },
    { id: 'listing-3', title: 'Digital Marketing Agency' },
    { id: 'listing-4', title: 'Mobile App Startup' },
  ];

  const users = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com' },
  ];

  return listings.slice(0, 3).map((listing, index) => {
    const user = users[index % users.length];
    const statuses: VerificationStatus[] = ['pending', 'approved', 'rejected'];
    const status = statuses[index % 3];
    
    const baseRequest: VerificationRequest = {
      id: generateId(),
      listingId: listing.id,
      listingTitle: listing.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status,
      documents: [],
      notes: 'Please verify the attached financial documents.',
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };

    if (status !== 'pending') {
      baseRequest.reviewedAt = new Date();
      baseRequest.reviewedBy = 'admin-owner';
      baseRequest.reviewedByName = 'Platform Owner';
      baseRequest.adminNotes = status === 'approved' ? 'All documents verified successfully.' : 'Documents could not be verified.';
      if (status === 'rejected') {
        baseRequest.rejectionReason = 'Insufficient documentation provided.';
      }
    }

    // Add demo documents
    baseRequest.documents = [
      {
        id: `doc-${index}-1`,
        type: 'financial_statement',
        fileName: 'financial_statement_2024.pdf',
        fileSize: 245000,
        mimeType: 'application/pdf',
        uploadedAt: new Date(baseRequest.submittedAt),
        uploadedBy: user.id,
        uploadedByName: user.name,
        data: 'demo_base64_data_placeholder',
      },
      {
        id: `doc-${index}-2`,
        type: 'tax_return',
        fileName: 'tax_return_2023.pdf',
        fileSize: 180000,
        mimeType: 'application/pdf',
        uploadedAt: new Date(baseRequest.submittedAt),
        uploadedBy: user.id,
        uploadedByName: user.name,
        data: 'demo_base64_data_placeholder',
      },
    ];

    return baseRequest;
  });
}

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<VerificationRequest[]>(getInitialVerifications);
  const [isLoading] = useState(false);

  // Initialize with demo data if empty
  useEffect(() => {
    if (requests.length === 0) {
      const demoData = generateDemoRequests();
      setRequests(demoData);
      saveVerifications(demoData);
    }
  }, [requests.length]);

  const submitVerification = useCallback((
    listingId: string,
    listingTitle: string,
    userId: string,
    userName: string,
    userEmail: string,
    notes?: string
  ): VerificationRequest => {
    // Check if there's already a pending request for this listing
    const existingPending = requests.find(r => r.listingId === listingId && r.status === 'pending');
    if (existingPending) {
      throw new Error('A pending verification request already exists for this listing');
    }

    const newRequest: VerificationRequest = {
      id: generateId(),
      listingId,
      listingTitle,
      userId,
      userName,
      userEmail,
      status: 'pending',
      documents: [],
      notes,
      submittedAt: new Date(),
    };

    setRequests(prev => {
      const updated = [newRequest, ...prev];
      saveVerifications(updated);
      return updated;
    });

    return newRequest;
  }, [requests]);

  const uploadDocument = useCallback((requestId: string, document: DocumentUploadInput) => {
    setRequests(prev => {
      const updated = prev.map(request => {
        if (request.id === requestId && request.status === 'pending') {
          const newDoc: VerificationDocument = {
            id: generateId(),
            type: document.type,
            fileName: document.fileName,
            fileSize: document.fileSize,
            mimeType: document.mimeType,
            data: document.data,
            uploadedAt: new Date(),
            uploadedBy: request.userId,
            uploadedByName: request.userName,
          };
          return {
            ...request,
            documents: [...request.documents, newDoc],
          };
        }
        return request;
      });
      saveVerifications(updated);
      return updated;
    });
  }, []);

  const removeDocument = useCallback((requestId: string, documentId: string) => {
    setRequests(prev => {
      const updated = prev.map(request => {
        if (request.id === requestId && request.status === 'pending') {
          return {
            ...request,
            documents: request.documents.filter(d => d.id !== documentId),
          };
        }
        return request;
      });
      saveVerifications(updated);
      return updated;
    });
  }, []);

  const approveVerification = useCallback((requestId: string, adminNotes?: string) => {
    setRequests(prev => {
      const updated = prev.map(request => {
        if (request.id === requestId && request.status === 'pending') {
          return {
            ...request,
            status: 'approved' as VerificationStatus,
            reviewedAt: new Date(),
            adminNotes,
          };
        }
        return request;
      });
      saveVerifications(updated);
      return updated;
    });
  }, []);

  const rejectVerification = useCallback((requestId: string, reason: string, adminNotes?: string) => {
    setRequests(prev => {
      const updated = prev.map(request => {
        if (request.id === requestId && request.status === 'pending') {
          return {
            ...request,
            status: 'rejected' as VerificationStatus,
            reviewedAt: new Date(),
            rejectionReason: reason,
            adminNotes,
          };
        }
        return request;
      });
      saveVerifications(updated);
      return updated;
    });
  }, []);

  const deleteRequest = useCallback((requestId: string) => {
    setRequests(prev => {
      const updated = prev.filter(r => r.id !== requestId);
      saveVerifications(updated);
      return updated;
    });
  }, []);

  const getRequestById = useCallback((requestId: string): VerificationRequest | undefined => {
    return requests.find(r => r.id === requestId);
  }, [requests]);

  const getRequestsByListing = useCallback((listingId: string): VerificationRequest[] => {
    return requests.filter(r => r.listingId === listingId);
  }, [requests]);

  const getRequestsByUser = useCallback((userId: string): VerificationRequest[] => {
    return requests.filter(r => r.userId === userId);
  }, [requests]);

  const getRequestsByStatus = useCallback((status: VerificationStatus): VerificationRequest[] => {
    return requests.filter(r => r.status === status);
  }, [requests]);

  const getPendingRequests = useCallback((): VerificationRequest[] => {
    return requests.filter(r => r.status === 'pending');
  }, [requests]);

  const getVerifiedListings = useCallback((): string[] => {
    return requests
      .filter(r => r.status === 'approved')
      .map(r => r.listingId);
  }, [requests]);

  const isListingVerified = useCallback((listingId: string): boolean => {
    return requests.some(r => r.listingId === listingId && r.status === 'approved');
  }, [requests]);

  const getStats = useCallback(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
    };
  }, [requests]);

  return (
    <VerificationContext.Provider
      value={{
        requests,
        isLoading,
        submitVerification,
        uploadDocument,
        removeDocument,
        approveVerification,
        rejectVerification,
        deleteRequest,
        getRequestById,
        getRequestsByListing,
        getRequestsByUser,
        getRequestsByStatus,
        getPendingRequests,
        getVerifiedListings,
        isListingVerified,
        getStats,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    return {
      requests: [],
      isLoading: false,
      submitVerification: () => ({ id: '', listingId: '', listingTitle: '', userId: '', userName: '', userEmail: '', status: 'pending' as VerificationStatus, documents: [], submittedAt: new Date() }),
      uploadDocument: () => {},
      removeDocument: () => {},
      approveVerification: () => {},
      rejectVerification: () => {},
      deleteRequest: () => {},
      getRequestById: () => undefined,
      getRequestsByListing: () => [],
      getRequestsByUser: () => [],
      getRequestsByStatus: () => [],
      getPendingRequests: () => [],
      getVerifiedListings: () => [],
      isListingVerified: () => false,
      getStats: () => ({ total: 0, pending: 0, approved: 0, rejected: 0 }),
    };
  }
  return context;
}
