'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Bell, Plus, Trash2, TrendingDown, TrendingUp, 
  AlertCircle, Check, X, Settings, Clock, DollarSign,
  ChevronDown, Eye
} from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertCondition, ALERT_CONDITION_LABELS, PriceAlert } from '@/types/watchlist';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/data';
import { formatDistanceToNow } from '@/lib/utils';
import { toast } from 'sonner';

interface WatchlistWithAlertsProps {
  listings: Listing[];
  onViewListing?: (listingId: string) => void;
}

export function WatchlistWithAlerts({ listings, onViewListing }: WatchlistWithAlertsProps) {
  const { 
    items, 
    stats, 
    addToWatchlist, 
    removeFromWatchlist, 
    updateNotes,
    isInWatchlist,
    addPriceAlert,
    removePriceAlert,
    getAlertsForListing,
    checkPriceAlerts,
  } = useWatchlist();
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [alertCondition, setAlertCondition] = useState<AlertCondition>('drop_below');
  const [alertValue, setAlertValue] = useState('');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  
  // Get watchlist items with listing data
  const watchlistItems = items.map(item => {
    const listing = listings.find(l => l.id === item.listingId);
    return { ...item, listing };
  }).filter(item => item.listing);
  
  // Get listing for adding alert
  const selectedListing = listings.find(l => l.id === selectedItem);
  
  const handleAddAlert = () => {
    if (!selectedItem || !alertValue) return;
    
    const value = parseFloat(alertValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }
    
    addPriceAlert(selectedItem, alertCondition, value);
    setShowAddAlertModal(false);
    setAlertValue('');
    toast.success('Price alert added');
  };
  
  const handleRemoveAlert = (listingId: string, alertId: string) => {
    removePriceAlert(listingId, alertId);
    toast.success('Alert removed');
  };
  
  const handleUpdateNotes = (listingId: string, newNotes: string) => {
    updateNotes(listingId, newNotes);
    setEditingNotes(null);
    toast.success('Notes updated');
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Total Items</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Active Alerts</span>
          </div>
          <p className="text-2xl font-bold">{stats.activeAlerts}</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">Triggered</span>
          </div>
          <p className="text-2xl font-bold">{stats.triggeredAlerts}</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Avg Change</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            stats.averagePriceChange >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {stats.averagePriceChange >= 0 ? '+' : ''}{stats.averagePriceChange.toFixed(1)}%
          </p>
        </div>
      </div>
      
      {/* Watchlist Items */}
      {watchlistItems.length === 0 ? (
        <GlassPanel className="p-8 text-center">
          <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Save listings to your watchlist to track prices and get alerts
          </p>
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          {watchlistItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-secondary/30 border border-border/50"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Listing Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.listing?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.listing?.category} • {item.listing?.region}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-accent">
                        {formatCurrency(item.listing?.price || 0)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Added {formatDistanceToNow(item.addedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {onViewListing && (
                    <button
                      onClick={() => onViewListing(item.listingId)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="View listing"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedItem(item.listingId);
                      setShowAddAlertModal(true);
                    }}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Add price alert"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Remove this listing from your watchlist?')) {
                        removeFromWatchlist(item.listingId);
                        toast.success('Removed from watchlist');
                      }
                    }}
                    className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Notes */}
              <div className="mt-4 pt-4 border-t border-border/50">
                {editingNotes === item.listingId ? (
                  <div className="flex gap-2">
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpdateNotes(item.listingId, notes)}
                      size="sm"
                      className="btn-accent"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setEditingNotes(null)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-secondary/30 p-2 rounded-lg -ml-2"
                    onClick={() => {
                      setEditingNotes(item.listingId);
                      setNotes(item.notes || '');
                    }}
                  >
                    {item.notes ? (
                      <p className="text-sm text-muted-foreground italic">"{item.notes}"</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Click to add notes...</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Price Alerts */}
              {item.priceAlerts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Price Alerts ({item.priceAlerts.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.priceAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm flex items-center gap-2",
                          alert.triggered 
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-secondary border border-border"
                        )}
                      >
                        {alert.triggered ? (
                          <Check className="w-4 h-4" />
                        ) : alert.type === 'drop_below' || alert.type === 'percentage_drop' ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        )}
                        <span>
                          {ALERT_CONDITION_LABELS[alert.type]}
                          {alert.type === 'percentage_drop' ? ` ${alert.percentageThreshold}%` : 
                           alert.type !== 'any_change' ? ` $${alert.targetValue.toLocaleString()}` : ''}
                        </span>
                        <button
                          onClick={() => handleRemoveAlert(item.listingId, alert.id)}
                          className="p-0.5 hover:bg-secondary rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Add Alert Modal */}
      <AnimatePresence>
        {showAddAlertModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowAddAlertModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative z-10 w-full max-w-md"
            >
              <GlassPanel className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add Price Alert</h3>
                
                <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
                  <p className="font-medium">{selectedListing.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Current price: {formatCurrency(selectedListing.price)}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Alert Type</label>
                    <select
                      value={alertCondition}
                      onChange={(e) => setAlertCondition(e.target.value as AlertCondition)}
                      className="w-full p-3 rounded-xl border border-border bg-background"
                    >
                      {Object.entries(ALERT_CONDITION_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {alertCondition !== 'any_change' && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        {alertCondition === 'percentage_drop' ? 'Percentage (%)' : 'Price ($)'}
                      </label>
                      <Input
                        type="number"
                        value={alertValue}
                        onChange={(e) => setAlertValue(e.target.value)}
                        placeholder={alertCondition === 'percentage_drop' ? '10' : '100000'}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowAddAlertModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddAlert}
                    className="btn-accent flex-1"
                    disabled={alertCondition !== 'any_change' && !alertValue}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Add Alert
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
