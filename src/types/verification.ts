// Verification System Types

export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type VerificationDocumentType = 
  | 'financial_statement'
  | 'tax_return'
  | 'bank_statement'
  | 'business_license'
  | 'incorporation_doc'
  | 'identity_proof'
  | 'other';

export interface VerificationDocument {
  id: string;
  type: VerificationDocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  uploadedByName: string;
  // In a real app, this would be a URL to secure storage
  // For demo, we'll store base64 data
  data: string;
}

export interface VerificationRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: VerificationStatus;
  documents: VerificationDocument[];
  notes?: string;
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewedByName?: string;
  rejectionReason?: string;
}

export interface VerificationInput {
  listingId: string;
  listingTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  notes?: string;
}

export interface DocumentUploadInput {
  type: VerificationDocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string;
}

export const DOCUMENT_TYPE_LABELS: Record<VerificationDocumentType, string> = {
  financial_statement: 'Financial Statement',
  tax_return: 'Tax Return',
  bank_statement: 'Bank Statement',
  business_license: 'Business License',
  incorporation_doc: 'Incorporation Document',
  identity_proof: 'Identity Proof',
  other: 'Other Document',
};

export const DOCUMENT_TYPE_DESCRIPTIONS: Record<VerificationDocumentType, string> = {
  financial_statement: 'Profit & loss statements, balance sheets, or similar financial documents',
  tax_return: 'Business tax returns showing revenue and expenses',
  bank_statement: 'Bank statements showing business transactions',
  business_license: 'Official business registration or license',
  incorporation_doc: 'Articles of incorporation or similar formation documents',
  identity_proof: 'Government-issued ID of business owner(s)',
  other: 'Any other supporting documentation',
};

export const VERIFICATION_STATUS_CONFIG: Record<VerificationStatus, { color: string; label: string }> = {
  pending: { color: 'bg-amber-500/10 text-amber-500', label: 'Pending Review' },
  approved: { color: 'bg-green-500/10 text-green-500', label: 'Approved' },
  rejected: { color: 'bg-red-500/10 text-red-500', label: 'Rejected' },
};
