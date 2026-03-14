'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { 
  PlatformAnnouncement, 
  AnnouncementInput, 
  AnnouncementStatus,
  ANNOUNCEMENT_TYPE_CONFIG
} from '@/types/announcements';

interface AnnouncementsContextType {
  announcements: PlatformAnnouncement[];
  publishedAnnouncements: PlatformAnnouncement[];
  bannerAnnouncements: PlatformAnnouncement[];
  isLoading: boolean;
  createAnnouncement: (data: AnnouncementInput, userId: string, userName: string) => Promise<PlatformAnnouncement>;
  updateAnnouncement: (id: string, data: Partial<AnnouncementInput>) => Promise<{ success: boolean; error?: string }>;
  deleteAnnouncement: (id: string) => Promise<{ success: boolean; error?: string }>;
  publishAnnouncement: (id: string) => Promise<{ success: boolean; error?: string }>;
  unpublishAnnouncement: (id: string) => Promise<{ success: boolean; error?: string }>;
  dismissAnnouncement: (id: string) => void;
  isDismissed: (id: string) => boolean;
  incrementView: (id: string) => void;
  getAnnouncementById: (id: string) => PlatformAnnouncement | undefined;
  getStats: () => { total: number; published: number; drafts: number; scheduled: number };
}

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

const ANNOUNCEMENTS_KEY = 'gee_announcements';
const DISMISSED_KEY = 'gee_dismissed_announcements';

// Helper to generate unique ID
function generateId(): string {
  return `ANN-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
}

// Get stored announcements from localStorage
function getStoredAnnouncements(): PlatformAnnouncement[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save announcements to localStorage
function saveAnnouncements(announcements: PlatformAnnouncement[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
  } catch (e) {
    console.error('Failed to save announcements:', e);
  }
}

// Get dismissed announcement IDs
function getDismissedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(DISMISSED_KEY);
    return new Set(data ? JSON.parse(data) : []);
  } catch {
    return new Set();
  }
}

// Save dismissed IDs
function saveDismissedIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
  } catch (e) {
    console.error('Failed to save dismissed:', e);
  }
}

// Lazy initializer for useState
function getInitialAnnouncements(): PlatformAnnouncement[] {
  if (typeof window === 'undefined') return [];
  return getStoredAnnouncements();
}

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(getInitialAnnouncements);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(getDismissedIds);
  const [isLoading, setIsLoading] = useState(false);

  // Check for scheduled announcements to publish
  useEffect(() => {
    const now = new Date();
    let hasChanges = false;
    
    const updated = announcements.map(ann => {
      if (ann.status === 'scheduled' && ann.scheduledAt && new Date(ann.scheduledAt) <= now) {
        hasChanges = true;
        return { ...ann, status: 'published' as AnnouncementStatus, publishedAt: now };
      }
      if (ann.status === 'published' && ann.expiresAt && new Date(ann.expiresAt) <= now) {
        hasChanges = true;
        return { ...ann, status: 'expired' as AnnouncementStatus };
      }
      return ann;
    });
    
    if (hasChanges) {
      setAnnouncements(updated);
      saveAnnouncements(updated);
    }
  }, [announcements]);

  // Get published announcements that aren't expired
  const publishedAnnouncements = announcements.filter(
    a => a.status === 'published' && (!a.expiresAt || new Date(a.expiresAt) > new Date())
  );

  // Get banner announcements (show as banner at top of page)
  const bannerAnnouncements = publishedAnnouncements.filter(a => a.showAsBanner);

  const createAnnouncement = useCallback(async (
    data: AnnouncementInput, 
    userId: string, 
    userName: string
  ): Promise<PlatformAnnouncement> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const now = new Date();
    const newAnnouncement: PlatformAnnouncement = {
      id: generateId(),
      title: data.title,
      content: data.content,
      type: data.type,
      priority: data.priority,
      status: data.status,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : undefined,
      expiresAt: data.expiresAt,
      scheduledAt: data.scheduledAt,
      targetRoles: data.targetRoles,
      isDismissible: data.isDismissible,
      showAsBanner: data.showAsBanner,
      showAsModal: data.showAsModal,
      linkUrl: data.linkUrl,
      linkText: data.linkText,
      views: 0,
      dismissals: 0,
    };
    
    setAnnouncements(prev => {
      const updated = [newAnnouncement, ...prev];
      saveAnnouncements(updated);
      return updated;
    });
    
    setIsLoading(false);
    return newAnnouncement;
  }, []);

  const updateAnnouncement = useCallback(async (
    id: string, 
    data: Partial<AnnouncementInput>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAnnouncements(prev => {
      const updated = prev.map(ann => {
        if (ann.id === id) {
          return { 
            ...ann, 
            ...data, 
            updatedAt: new Date(),
            publishedAt: data.status === 'published' && !ann.publishedAt ? new Date() : ann.publishedAt,
          };
        }
        return ann;
      });
      saveAnnouncements(updated);
      return updated;
    });
    
    setIsLoading(false);
    return { success: true };
  }, []);

  const deleteAnnouncement = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setAnnouncements(prev => {
      const updated = prev.filter(ann => ann.id !== id);
      saveAnnouncements(updated);
      return updated;
    });
    
    setIsLoading(false);
    return { success: true };
  }, []);

  const publishAnnouncement = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    return updateAnnouncement(id, { status: 'published' });
  }, [updateAnnouncement]);

  const unpublishAnnouncement = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    return updateAnnouncement(id, { status: 'draft' });
  }, [updateAnnouncement]);

  const dismissAnnouncement = useCallback((id: string) => {
    setDismissedIds(prev => {
      const updated = new Set(prev).add(id);
      saveDismissedIds(updated);
      return updated;
    });
    
    // Increment dismissal count
    setAnnouncements(prev => {
      const updated = prev.map(ann => {
        if (ann.id === id) {
          return { ...ann, dismissals: ann.dismissals + 1 };
        }
        return ann;
      });
      saveAnnouncements(updated);
      return updated;
    });
  }, []);

  const isDismissed = useCallback((id: string): boolean => {
    return dismissedIds.has(id);
  }, [dismissedIds]);

  const incrementView = useCallback((id: string) => {
    setAnnouncements(prev => {
      const updated = prev.map(ann => {
        if (ann.id === id) {
          return { ...ann, views: ann.views + 1 };
        }
        return ann;
      });
      saveAnnouncements(updated);
      return updated;
    });
  }, []);

  const getAnnouncementById = useCallback((id: string): PlatformAnnouncement | undefined => {
    return announcements.find(ann => ann.id === id);
  }, [announcements]);

  const getStats = useCallback(() => {
    return {
      total: announcements.length,
      published: announcements.filter(a => a.status === 'published').length,
      drafts: announcements.filter(a => a.status === 'draft').length,
      scheduled: announcements.filter(a => a.status === 'scheduled').length,
    };
  }, [announcements]);

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        publishedAnnouncements,
        bannerAnnouncements,
        isLoading,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        publishAnnouncement,
        unpublishAnnouncement,
        dismissAnnouncement,
        isDismissed,
        incrementView,
        getAnnouncementById,
        getStats,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    return {
      announcements: [],
      publishedAnnouncements: [],
      bannerAnnouncements: [],
      isLoading: false,
      createAnnouncement: async () => { throw new Error('Not available'); },
      updateAnnouncement: async () => ({ success: false, error: 'Not available' }),
      deleteAnnouncement: async () => ({ success: false, error: 'Not available' }),
      publishAnnouncement: async () => ({ success: false, error: 'Not available' }),
      unpublishAnnouncement: async () => ({ success: false, error: 'Not available' }),
      dismissAnnouncement: () => {},
      isDismissed: () => false,
      incrementView: () => {},
      getAnnouncementById: () => undefined,
      getStats: () => ({ total: 0, published: 0, drafts: 0, scheduled: 0 }),
    };
  }
  return context;
}
