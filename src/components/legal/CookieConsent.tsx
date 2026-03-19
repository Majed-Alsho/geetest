'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'gee_cookie_consent';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

// Helper function to apply cookie preferences (outside component)
const applyCookiePreferences = (prefs: CookiePreferences) => {
  if (prefs.analytics) {
    console.log('Analytics cookies enabled');
  }
  if (prefs.marketing) {
    console.log('Marketing cookies enabled');
  }
  if (prefs.functional) {
    console.log('Functional cookies enabled');
  }
};

// Create a store for cookie consent state
let consentListeners: Array<() => void> = [];
let cachedPreferences: CookiePreferences | null = null;

function notifyConsentListeners() {
  consentListeners.forEach(listener => listener());
}

function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  if (cachedPreferences !== null) return cachedPreferences;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      cachedPreferences = JSON.parse(stored);
      return cachedPreferences;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

function subscribeToConsent(callback: () => void) {
  consentListeners.push(callback);
  return () => {
    consentListeners = consentListeners.filter(l => l !== callback);
  };
}

function getConsentSnapshot(): CookiePreferences | null {
  return getStoredPreferences();
}

function getServerConsentSnapshot(): CookiePreferences | null {
  return null;
}

function saveToStorage(prefs: CookiePreferences): boolean {
  if (typeof window === 'undefined') return false;
  try {
    cachedPreferences = prefs;
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    notifyConsentListeners();
    return true;
  } catch (error) {
    console.error('Failed to save cookie preferences:', error);
    // Still update cached preferences for this session
    cachedPreferences = prefs;
    return false;
  }
}

export function CookieConsent() {
  const [showSettings, setShowSettings] = useState(false);
  const [pendingPrefs, setPendingPrefs] = useState<CookiePreferences>(defaultPreferences);
  const [showBanner, setShowBanner] = useState(false);
  const hasScheduledCheck = useRef(false);
  
  // Use useSyncExternalStore for SSR-safe state
  const storedPreferences = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  // Schedule banner check once on mount (using useEffect for side effects)
  useEffect(() => {
    if (hasScheduledCheck.current) return;
    hasScheduledCheck.current = true;
    
    const timer = setTimeout(() => {
      if (!storedPreferences) {
        setShowBanner(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [storedPreferences]);

  const savePreferences = useCallback((prefs: CookiePreferences) => {
    // Always close the banner and apply preferences, even if storage fails
    saveToStorage(prefs);
    applyCookiePreferences(prefs);
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      setShowBanner(false);
      setShowSettings(false);
    }, 0);
  }, []);

  const acceptAll = useCallback(() => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  }, [savePreferences]);

  const rejectAll = useCallback(() => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  }, [savePreferences]);

  const saveCustomPreferences = useCallback(() => {
    savePreferences(pendingPrefs);
  }, [pendingPrefs, savePreferences]);

  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setPendingPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const openSettings = useCallback(() => {
    setPendingPrefs(storedPreferences || defaultPreferences);
    setShowSettings(true);
  }, [storedPreferences]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed left-0 right-0 z-[100] px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))] max-h-[90vh] overflow-y-auto"
        style={{ bottom: 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {!showSettings ? (
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      We use cookies to enhance your browsing experience and analyze traffic. 
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                      <Link href="/privacy" className="text-accent hover:underline ml-1">
                        Learn more
                      </Link>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button onClick={acceptAll} className="btn-accent w-full sm:w-auto">
                        <Check className="w-4 h-4 mr-2" />
                        Accept All
                      </Button>
                      <Button onClick={rejectAll} variant="outline" className="btn-secondary w-full sm:w-auto">
                        Reject Optional
                      </Button>
                      <Button 
                        onClick={openSettings}
                        variant="ghost"
                        className="text-muted-foreground w-full sm:w-auto"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                    </div>
                  </div>
                  <button 
                    onClick={rejectAll}
                    className="p-1 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold">Cookie Preferences</h3>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="p-1 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Back"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium flex items-center gap-2 flex-wrap">
                          Necessary Cookies
                          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Essential for the website to function.
                        </p>
                      </div>
                      <div className="w-12 h-6 bg-accent/20 rounded-full flex items-center justify-end px-1 flex-shrink-0">
                        <div className="w-4 h-4 bg-accent rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium">Analytics Cookies</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${
                          pendingPrefs.analytics ? 'bg-accent justify-end' : 'bg-secondary justify-start'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-colors ${
                          pendingPrefs.analytics ? 'bg-white' : 'bg-muted-foreground'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium">Functional Cookies</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Enable enhanced functionality like saved preferences.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('functional')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${
                          pendingPrefs.functional ? 'bg-accent justify-end' : 'bg-secondary justify-start'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-colors ${
                          pendingPrefs.functional ? 'bg-white' : 'bg-muted-foreground'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium">Marketing Cookies</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Used to deliver relevant ads based on your interests.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${
                          pendingPrefs.marketing ? 'bg-accent justify-end' : 'bg-secondary justify-start'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-colors ${
                          pendingPrefs.marketing ? 'bg-white' : 'bg-muted-foreground'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={saveCustomPreferences} className="btn-accent flex-1">
                    Save Preferences
                  </Button>
                  <Button onClick={acceptAll} variant="outline" className="flex-1">
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to check cookie consent - uses useSyncExternalStore for SSR safety
export function useCookieConsent() {
  return useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
}
