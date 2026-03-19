'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';
import { cn } from '@/lib/utils';

export function CompareBar() {
  const { compareListings, removeFromCompare, clearCompare, maxCompare } = useCompare();
  const router = useRouter();

  const handleCompare = () => {
    if (compareListings.length >= 2) {
      router.push('/compare');
    }
  };

  if (compareListings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-lg"
      >
        <div className="container-wide">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Scale className="w-5 h-5 text-accent" />
                <span>Compare ({compareListings.length}/{maxCompare})</span>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                {compareListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm"
                  >
                    <span className="max-w-[120px] truncate">{listing.title}</span>
                    <button
                      onClick={() => removeFromCompare(listing.id)}
                      className="p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCompare}
                className={cn(
                  "btn-accent",
                  compareListings.length < 2 && "opacity-50 pointer-events-none"
                )}
              >
                Compare
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
