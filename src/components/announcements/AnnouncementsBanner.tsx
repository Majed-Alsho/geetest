'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, Wrench, ExternalLink } from 'lucide-react';
import { useAnnouncements } from '@/contexts/AnnouncementsContext';
import { ANNOUNCEMENT_TYPE_CONFIG } from '@/types/announcements';
import { cn } from '@/lib/utils';

const ICONS = {
  Info: Info,
  AlertTriangle: AlertTriangle,
  CheckCircle: CheckCircle,
  Wrench: Wrench,
};

export function AnnouncementsBanner() {
  const { bannerAnnouncements, isDismissed, dismissAnnouncement } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter out dismissed announcements
  const visibleAnnouncements = bannerAnnouncements.filter(a => !isDismissed(a.id));
  
  // Get current announcement
  const currentAnnouncement = visibleAnnouncements[currentIndex];
  
  // Rotate through announcements every 10 seconds
  useEffect(() => {
    if (visibleAnnouncements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % visibleAnnouncements.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [visibleAnnouncements.length]);
  
  // Reset index if current announcement is dismissed
  useEffect(() => {
    if (currentIndex >= visibleAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [visibleAnnouncements.length, currentIndex]);
  
  if (!currentAnnouncement) return null;
  
  const typeConfig = ANNOUNCEMENT_TYPE_CONFIG[currentAnnouncement.type];
  const Icon = ICONS[typeConfig.icon];
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAnnouncement.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "w-full py-2 px-4 flex items-center justify-center gap-3 text-sm border-b",
          typeConfig.color
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        
        <div className="flex-1 text-center">
          <span className="font-medium">{currentAnnouncement.title}</span>
          {currentAnnouncement.content && (
            <>
              <span className="mx-2">•</span>
              <span className="opacity-90">{currentAnnouncement.content}</span>
            </>
          )}
        </div>
        
        {currentAnnouncement.linkUrl && (
          <a
            href={currentAnnouncement.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 underline hover:no-underline"
          >
            {currentAnnouncement.linkText || 'Learn More'}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        
        {visibleAnnouncements.length > 1 && (
          <div className="flex items-center gap-1">
            {visibleAnnouncements.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i === currentIndex ? "bg-current" : "bg-current/30"
                )}
              />
            ))}
          </div>
        )}
        
        {currentAnnouncement.isDismissible && (
          <button
            onClick={() => dismissAnnouncement(currentAnnouncement.id)}
            className="p-1 hover:bg-current/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
