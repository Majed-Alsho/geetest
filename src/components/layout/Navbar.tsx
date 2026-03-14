'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Building2, User, LogOut, LogIn } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, ViewType } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';

const navLinks = [
  { view: 'home', label: 'Home' },
  { view: 'marketplace', label: 'Marketplace' },
  { view: 'investors', label: 'Investment Portal' },
  { view: 'how-it-works', label: 'How It Works' },
  { view: 'security', label: 'Security' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentView, navigateTo } = useNavigation();

  // Prevent hydration mismatch by only rendering client-specific content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigateTo('home');
    setIsOpen(false);
  };

  const handleNavigate = (view: string) => {
    navigateTo(view as ViewType);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel mx-4 mt-4 rounded-2xl">
        <nav className="container-wide">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <button 
              onClick={() => handleNavigate('home')} 
              className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
            >
              <Building2 className="w-6 h-6 text-accent" />
              <span className="font-semibold text-lg hidden sm:block">
                Global Equity Exchange
              </span>
              <span className="font-semibold text-lg sm:hidden">
                GEE
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => handleNavigate(link.view)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    mounted && currentView === link.view
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications - Only for authenticated users */}
              {mounted && isAuthenticated && <NotificationsDropdown />}
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="relative z-10 p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {mounted && theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* Auth buttons */}
              {mounted && isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate('login')}
                  className="hidden sm:inline-flex btn-accent text-sm px-4 py-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden glass-panel mx-4 mt-2 rounded-2xl overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => handleNavigate(link.view)}
                  className={cn(
                    "block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    mounted && currentView === link.view
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile auth section */}
              <div className="pt-4 mt-4 border-t border-border">
                {mounted && isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">{user?.name}</span>
                      {user?.role !== 'user' && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full capitalize">
                          {user?.role}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigate('profile')}
                      className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      Profile & Settings
                    </button>
                    {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'owner') && (
                      <button
                        onClick={() => handleNavigate('admin')}
                        className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigate('login')}
                      className="block w-full btn-accent text-sm text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavigate('signup')}
                      className="block w-full btn-secondary text-sm text-center"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
