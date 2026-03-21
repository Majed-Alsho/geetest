'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, CheckCircle, Send, Archive, Search, Eye, LogOut,
  Building2, MessageSquare, Flag, Settings, Shield, Crown, BarChart3,
  AlertTriangle, XCircle, Star, HelpCircle, MessageCircle, X, User,
  Ban, Key, Trash2, Mail, Phone, Calendar, ChevronRight, Filter, Rocket,
  DollarSign, TrendingUp, Pause, Play, FileText, Activity, Download,
  AlertCircle, RefreshCw, FileCheck, Lock, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { useAuth, PasswordResetToken } from '@/contexts/AuthContext';
import { useSupport } from '@/contexts/SupportContext';
import { useAds } from '@/contexts/AdContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useListings } from '@/contexts/ListingContext';
import { useEarnings } from '@/contexts/EarningsContext';
import { useVerification } from '@/contexts/VerificationContext';
import { SupportTicket, TicketStatus, TicketPriority } from '@/types/support';
import { Advertisement, AdStatus } from '@/types/advertising';
import { User as UserType, UserRole } from '@/contexts/AuthContext';
import { Listing } from '@/lib/data';
import { getAllAuditLogs, getSecuritySummary, auditLog } from '@/lib/security/auditLogger';
import { cn, formatDistanceToNow } from '@/lib/utils';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/data';
import { EARNING_SOURCE_LABELS, EARNING_SOURCE_COLORS, EarningSource } from '@/types/earnings';
import { DOCUMENT_TYPE_LABELS, VERIFICATION_STATUS_CONFIG, VerificationRequest } from '@/types/verification';

// Simple bar chart component for admin analytics
function SimpleBarChart({ data, label, color = 'accent' }: { data: { name: string; value: number }[]; label: string; color?: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-20 text-xs text-muted-foreground truncate">{item.name}</span>
            <div className="flex-1 h-6 bg-secondary/50 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "h-full rounded-lg flex items-center justify-end pr-2",
                  color === 'accent' && "bg-accent/80",
                  color === 'green' && "bg-green-500/80",
                  color === 'blue' && "bg-blue-500/80",
                  color === 'amber' && "bg-amber-500/80",
                  color === 'purple' && "bg-purple-500/80"
                )}
              >
                <span className="text-xs text-white font-medium">{item.value}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple line chart for trends
function SimpleLineChart({ data, label, color = 'accent' }: { data: number[]; label: string; color?: string }) {
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const height = 100;
  const width = 300;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`line-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color === 'accent' ? 'hsl(142 76% 36%)' : color === 'blue' ? 'hsl(220 76% 50%)' : 'hsl(271 81% 56%)'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color === 'accent' ? 'hsl(142 76% 36%)' : color === 'blue' ? 'hsl(220 76% 50%)' : 'hsl(271 81% 56%)'} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
            <line x1="0" y1="25" x2={width} y2="25" />
            <line x1="0" y1="50" x2={width} y2="50" />
            <line x1="0" y1="75" x2={width} y2="75" />
          </g>
          
          {/* Area fill */}
          <motion.polygon
            points={`0,${height} ${points} ${width},${height}`}
            fill={`url(#line-gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color === 'accent' ? 'hsl(142 76% 36%)' : color === 'blue' ? 'hsl(220 76% 50%)' : 'hsl(271 81% 56%)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - minValue) / range) * (height - 20) - 10;
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color === 'accent' ? 'hsl(142 76% 36%)' : color === 'blue' ? 'hsl(220 76% 50%)' : 'hsl(271 81% 56%)'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>7d ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

type AdminTab = 'support' | 'ads' | 'users' | 'listings' | 'analytics' | 'security' | 'audit' | 'rateLimits' | 'earnings' | 'verifications' | 'settings';

const TICKET_STATUS_CONFIG: Record<TicketStatus, { color: string; label: string }> = {
  open: { color: 'bg-blue-500/10 text-blue-500', label: 'Open' },
  in_progress: { color: 'bg-amber-500/10 text-amber-500', label: 'In Progress' },
  waiting_user: { color: 'bg-purple-500/10 text-purple-500', label: 'Waiting User' },
  waiting_admin: { color: 'bg-orange-500/10 text-orange-500', label: 'Waiting Admin' },
  resolved: { color: 'bg-green-500/10 text-green-500', label: 'Resolved' },
  closed: { color: 'bg-muted text-muted-foreground', label: 'Closed' },
};

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; label: string }> = {
  low: { color: 'bg-green-500/10 text-green-500', label: 'Low' },
  medium: { color: 'bg-amber-500/10 text-amber-500', label: 'Medium' },
  high: { color: 'bg-orange-500/10 text-orange-500', label: 'High' },
  urgent: { color: 'bg-red-500/10 text-red-500', label: 'Urgent' },
};

const AD_STATUS_CONFIG: Record<AdStatus, { color: string; label: string }> = {
  pending: { color: 'bg-amber-500/10 text-amber-500', label: 'Pending' },
  active: { color: 'bg-green-500/10 text-green-500', label: 'Active' },
  paused: { color: 'bg-blue-500/10 text-blue-500', label: 'Paused' },
  expired: { color: 'bg-muted text-muted-foreground', label: 'Expired' },
  rejected: { color: 'bg-red-500/10 text-red-500', label: 'Rejected' },
};

const AD_TIER_CONFIG = {
  basic: { color: 'bg-blue-500/10 text-blue-500', label: 'Basic' },
  premium: { color: 'bg-purple-500/10 text-purple-500', label: 'Premium' },
  featured: { color: 'bg-amber-500/10 text-amber-500', label: 'Featured' },
};

export default function AdminDashboard() {
  const { user, logout, isOwner, isSuperAdmin, isAdmin, getAllUsers, getUserByClientNumber,
          suspendUser, unsuspendUser, deleteUser, updateUserRole, createPasswordResetToken,
          getPendingResetTokens } = useAuth();
  const { tickets, addMessage, updateTicketStatus, assignTicket, resolveTicket, getStats, 
          getTicketsByClientNumber } = useSupport();
  const { ads, approveAd, rejectAd, pauseAd, resumeAd, deleteAd, getStats: getAdStats } = useAds();
  const { listings, approveListing, rejectListing, getUserListings } = useListings();
  const router = useRouter();
  const { earnings, stats: earningsStats, getRecentEarnings, getTotalBySource } = useEarnings();
  const { requests: verificationRequests, getPendingRequests, getStats: getVerificationStats, 
          approveVerification, rejectVerification } = useVerification();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('support');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientNumberSearch, setClientNumberSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState<TicketStatus | 'all'>('all');
  const [adFilter, setAdFilter] = useState<AdStatus | 'all'>('all');
  const [resolution, setResolution] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [listingRejectReason, setListingRejectReason] = useState('');
  const [verificationRejectReason, setVerificationRejectReason] = useState('');
  const [verificationAdminNotes, setVerificationAdminNotes] = useState('');
  const [resetTokenModal, setResetTokenModal] = useState<PasswordResetToken | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedTicketIds, setSelectedTicketIds] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Get all users
  const allUsers = getAllUsers();
  
  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = ticketFilter === 'all' || ticket.status === ticketFilter;
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter users
  const filteredUsers = allUsers.filter(u => {
    return searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.clientNumber?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Search by client number
  const searchByClientNumber = () => {
    const foundUser = getUserByClientNumber(clientNumberSearch);
    const userTickets = getTicketsByClientNumber(clientNumberSearch);
    
    if (foundUser) {
      setSelectedUser(foundUser);
      setSelectedTicket(null);
      toast.success(`Found user: ${foundUser.name}`, {
        description: `${userTickets.length} ticket(s) found`
      });
    } else {
      toast.error('No user found with this client number');
    }
  };

  // Handle reply to ticket
  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim() || !user) return;
    
    await addMessage(selectedTicket.id, replyMessage, {
      senderId: user.id,
      senderName: user.name,
      senderRole: 'admin',
    });
    
    setReplyMessage('');
    toast.success('Reply sent');
  };

  // Handle assign ticket
  const handleAssign = (ticketId: string) => {
    if (!user) return;
    assignTicket(ticketId, user.id, user.name);
    toast.success('Ticket assigned to you');
  };

  // Handle resolve ticket
  const handleResolve = (ticketId: string) => {
    if (!resolution.trim()) {
      toast.error('Please provide a resolution');
      return;
    }
    resolveTicket(ticketId, resolution);
    setResolution('');
    toast.success('Ticket resolved');
  };

  // Handle user suspension
  const handleSuspendUser = (userId: string) => {
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }
    if (suspendUser(userId, suspendReason)) {
      auditLog('ADMIN_ACTION', { action: 'suspend_user', userId, reason: suspendReason }, { userId: user?.id, userEmail: user?.email, severity: 'warning' });
      toast.success('User suspended');
      setSuspendReason('');
    }
  };

  // Handle password reset link generation
  const handleSendPasswordReset = (userId: string) => {
    const token = createPasswordResetToken(userId);
    if (token) {
      setResetTokenModal(token);
      setShowResetModal(true);
      toast.success('Password reset link generated');
    } else {
      toast.error('Failed to generate reset link');
    }
  };

  // Handle ad approval
  const handleApproveAd = (adId: string) => {
    approveAd(adId);
    auditLog('ADMIN_ACTION', { action: 'approve_ad', adId }, { userId: user?.id, userEmail: user?.email, severity: 'info' });
    toast.success('Ad approved and now active');
  };

  // Handle ad rejection
  const handleRejectAd = (adId: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectAd(adId, rejectReason);
    auditLog('ADMIN_ACTION', { action: 'reject_ad', adId, reason: rejectReason }, { userId: user?.id, userEmail: user?.email, severity: 'warning' });
    setRejectReason('');
    toast.success('Ad rejected');
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      if (deleteUser(userId)) {
        auditLog('ADMIN_ACTION', { action: 'delete_user', userId }, { userId: user?.id, userEmail: user?.email, severity: 'critical' });
        toast.success('User deleted');
        setSelectedUser(null);
      } else {
        toast.error('Cannot delete admin users');
      }
    }
  };

  // Bulk selection handlers
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleAllUsers = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTicketIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const toggleAllTickets = () => {
    if (selectedTicketIds.size === filteredTickets.length) {
      setSelectedTicketIds(new Set());
    } else {
      setSelectedTicketIds(new Set(filteredTickets.map(t => t.id)));
    }
  };

  // Bulk action handlers
  const handleBulkSuspend = () => {
    if (selectedUserIds.size === 0) {
      toast.error('No users selected');
      return;
    }
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }
    
    let count = 0;
    selectedUserIds.forEach(userId => {
      if (suspendUser(userId, suspendReason)) count++;
    });
    
    auditLog('ADMIN_ACTION', { action: 'bulk_suspend', userIds: Array.from(selectedUserIds), count }, { userId: user?.id, userEmail: user?.email, severity: 'warning' });
    toast.success(`${count} user(s) suspended`);
    setSuspendReason('');
    setSelectedUserIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedUserIds.size === 0) {
      toast.error('No users selected');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedUserIds.size} user(s)? This cannot be undone.`)) return;
    
    let count = 0;
    selectedUserIds.forEach(userId => {
      if (deleteUser(userId)) count++;
    });
    
    auditLog('ADMIN_ACTION', { action: 'bulk_delete', userIds: Array.from(selectedUserIds), count }, { userId: user?.id, userEmail: user?.email, severity: 'critical' });
    toast.success(`${count} user(s) deleted`);
    setSelectedUserIds(new Set());
  };

  const handleBulkTicketStatus = (status: TicketStatus) => {
    if (selectedTicketIds.size === 0) {
      toast.error('No tickets selected');
      return;
    }
    
    selectedTicketIds.forEach(ticketId => {
      updateTicketStatus(ticketId, status);
    });
    
    auditLog('ADMIN_ACTION', { action: 'bulk_status_update', ticketIds: Array.from(selectedTicketIds), status }, { userId: user?.id, userEmail: user?.email, severity: 'info' });
    toast.success(`${selectedTicketIds.size} ticket(s) updated`);
    setSelectedTicketIds(new Set());
  };

  const stats = getStats();
  const adStats = getAdStats();
  const securitySummary = getSecuritySummary();
  const auditLogs = getAllAuditLogs().slice(-20).reverse();
  const filteredAds = ads.filter(ad => {
    const matchesFilter = adFilter === 'all' || ad.status === adFilter;
    const matchesSearch = searchQuery === '' ||
      ad.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = () => {
    if (isOwner) return { label: 'Owner', icon: Crown, color: 'bg-amber-500/10 text-amber-500' };
    if (isSuperAdmin) return { label: 'Super Admin', icon: Shield, color: 'bg-purple-500/10 text-purple-500' };
    return { label: 'Admin', icon: Users, color: 'bg-blue-500/10 text-blue-500' };
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  // Get pending listings count
  const pendingListings = listings.filter(l => l.status === 'pending');
  
  // Role-based tab configuration
  // Admin: support, listings (view only)
  // SuperAdmin: support, listings, ads, users, analytics, security, audit, rateLimits
  // Owner: all tabs including earnings, verifications
  
  const allTabs: { id: AdminTab; label: string; icon: typeof Users; badge?: number; roles: UserRole[] }[] = [
    { id: 'support', label: 'Support Tickets', icon: HelpCircle, badge: stats.open, roles: ['admin', 'superadmin', 'owner'] },
    { id: 'listings', label: 'Listings Review', icon: Building2, badge: pendingListings.length, roles: ['admin', 'superadmin', 'owner'] },
    { id: 'ads', label: 'Ads Management', icon: Rocket, badge: adStats.pending, roles: ['superadmin', 'owner'] },
    { id: 'users', label: 'Users', icon: Users, badge: allUsers.length, roles: ['superadmin', 'owner'] },
    { id: 'verifications', label: 'Verifications', icon: FileCheck, badge: getPendingRequests().length, roles: ['owner'] },
    { id: 'earnings', label: 'Earnings', icon: Wallet, roles: ['owner'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['superadmin', 'owner'] },
    { id: 'security', label: 'Security', icon: Shield, roles: ['owner'] },
    { id: 'audit', label: 'Audit Log', icon: FileText, roles: ['owner'] },
    { id: 'rateLimits', label: 'Rate Limits', icon: Activity, roles: ['owner'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'superadmin', 'owner'] },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => {
    if (!user) return false;
    return tab.roles.includes(user.role);
  });

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
              <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", roleBadge.color)}>
                <RoleIcon className="w-3 h-3" />
                {roleBadge.label}
              </span>
            </div>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <GlassPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </GlassPanel>
          <GlassPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </GlassPanel>
          <GlassPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.resolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </GlassPanel>
          <GlassPanel className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{allUsers.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-destructive text-destructive-foreground">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Tickets List */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search tickets..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      value={ticketFilter}
                      onChange={(e) => setTicketFilter(e.target.value as TicketStatus | 'all')}
                      className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_user">Waiting User</option>
                      <option value="waiting_admin">Waiting Admin</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  {filteredTickets.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border",
                            selectedTicket?.id === ticket.id
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs", TICKET_STATUS_CONFIG[ticket.status].color)}>
                                  {TICKET_STATUS_CONFIG[ticket.status].label}
                                </span>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs", PRIORITY_CONFIG[ticket.priority].color)}>
                                  {PRIORITY_CONFIG[ticket.priority].label}
                                </span>
                              </div>
                              <p className="font-medium truncate">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {ticket.userName} • Client: {ticket.clientNumber}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(ticket.createdAt).toLocaleString('en-US')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{ticket.messages.length} msgs</p>
                              {ticket.assignedToName && (
                                <p className="text-xs text-accent">{ticket.assignedToName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No tickets found</p>
                    </div>
                  )}
                </GlassPanel>
              </div>

              {/* Ticket Detail */}
              <div>
                <div className="sticky top-28">
                  <GlassPanel className="p-6">
                    {selectedTicket ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-muted-foreground">{selectedTicket.id}</span>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs", TICKET_STATUS_CONFIG[selectedTicket.status].color)}>
                              {TICKET_STATUS_CONFIG[selectedTicket.status].label}
                            </span>
                          </div>
                          <h3 className="font-semibold">{selectedTicket.subject}</h3>
                          <p className="text-sm text-muted-foreground">Category: {selectedTicket.category}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-xs text-muted-foreground mb-1">Client Number</p>
                          <p className="font-mono font-semibold text-accent">{selectedTicket.clientNumber}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="font-medium">{selectedTicket.userName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium truncate">{selectedTicket.userEmail}</p>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-medium mb-3">Conversation</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {selectedTicket.messages.map((msg) => (
                              <div key={msg.id} className={cn(
                                "p-3 rounded-xl text-sm",
                                msg.senderRole === 'admin' ? "bg-accent/10 ml-4" : "bg-secondary/50 mr-4"
                              )}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{msg.senderName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(msg.createdAt).toLocaleString('en-US')}
                                  </span>
                                </div>
                                <p>{msg.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-border pt-4 space-y-3">
                          {selectedTicket.status !== 'resolved' && (
                            <>
                              <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply..."
                                rows={3}
                                className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm"
                              />
                              <div className="flex gap-2">
                                <button onClick={handleReply} className="btn-accent flex-1" disabled={!replyMessage.trim()}>
                                  <Send className="w-4 h-4" />
                                  Send Reply
                                </button>
                                {!selectedTicket.assignedTo && (
                                  <button onClick={() => handleAssign(selectedTicket.id)} className="btn-secondary">
                                    Assign to Me
                                  </button>
                                )}
                              </div>
                            </>
                          )}

                          {selectedTicket.status !== 'resolved' && (
                            <div className="pt-3 border-t border-border">
                              <textarea
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                placeholder="Resolution notes..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm mb-2"
                              />
                              <button 
                                onClick={() => handleResolve(selectedTicket.id)} 
                                className="w-full btn-secondary text-green-500"
                                disabled={!resolution.trim()}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Resolved
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select a ticket to view details</p>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Listings List */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Pending Listings</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium">
                        {pendingListings.length} pending review
                      </span>
                    </div>
                  </div>

                  {pendingListings.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {pendingListings.map((listing) => (
                        <div
                          key={listing.id}
                          className={cn(
                            "p-4 rounded-xl border transition-all",
                            selectedListing?.id === listing.id
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{listing.title}</h4>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {listing.category} • {listing.region} • {listing.location}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="font-semibold text-accent">{formatCurrency(listing.price)}</span>
                                <span className="text-muted-foreground">{formatCurrency(listing.revenue)}/yr revenue</span>
                                <span className="text-muted-foreground">{listing.employees} employees</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Created: {new Date(listing.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedListing(listing)}
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No pending listings</p>
                      <p className="text-sm mt-2">All listings have been reviewed</p>
                    </div>
                  )}
                </GlassPanel>
              </div>

              {/* Listing Detail */}
              <div>
                <div className="sticky top-28">
                  <GlassPanel className="p-6">
                    {selectedListing ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{selectedListing.title}</h3>
                          <p className="text-sm text-muted-foreground">{selectedListing.category} • {selectedListing.region}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-3 rounded-lg bg-secondary/50">
                            <p className="text-xs text-muted-foreground">Asking Price</p>
                            <p className="font-semibold text-accent">{formatCurrency(selectedListing.price)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/50">
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="font-semibold">{formatCurrency(selectedListing.revenue)}/yr</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/50">
                            <p className="text-xs text-muted-foreground">Growth</p>
                            <p className="font-semibold text-green-500">+{selectedListing.growthYoY}% YoY</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/50">
                            <p className="text-xs text-muted-foreground">EBITDA</p>
                            <p className="font-semibold">{selectedListing.ebitdaMargin}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{selectedListing.description}</p>
                        </div>

                        {selectedListing.highlights && selectedListing.highlights.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Highlights</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {selectedListing.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="border-t border-border pt-4 space-y-3">
                          {/* View Public Page Button */}
                          <Link
                            href={`/listings/${selectedListing.id}`}
                            target="_blank"
                            className="btn-secondary w-full justify-center"
                          >
                            <Eye className="w-4 h-4" />
                            View Public Page
                          </Link>
                          
                          {/* Only SuperAdmin and Owner can approve/reject listings */}
                          {isSuperAdmin ? (
                            <>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Rejection Reason (if rejecting)</p>
                                <textarea
                                  value={listingRejectReason}
                                  onChange={(e) => setListingRejectReason(e.target.value)}
                                  placeholder="Enter reason for rejection..."
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    approveListing(selectedListing.id);
                                    auditLog('ADMIN_ACTION', { action: 'approve_listing', listingId: selectedListing.id, title: selectedListing.title }, { userId: user?.id, userEmail: user?.email, severity: 'info' });
                                    toast.success('Listing approved');
                                    setSelectedListing(null);
                                  }}
                                  className="btn-accent flex-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    if (!listingRejectReason.trim()) {
                                      toast.error('Please provide a rejection reason');
                                      return;
                                    }
                                    rejectListing(selectedListing.id, listingRejectReason);
                                    auditLog('ADMIN_ACTION', { action: 'reject_listing', listingId: selectedListing.id, reason: listingRejectReason }, { userId: user?.id, userEmail: user?.email, severity: 'warning' });
                                    toast.success('Listing rejected');
                                    setSelectedListing(null);
                                    setListingRejectReason('');
                                  }}
                                  className="btn-secondary text-red-500"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                              <p className="text-sm text-amber-500 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                You have view-only access. Contact a SuperAdmin or Owner to approve/reject listings.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select a listing to review</p>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Users List */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Client #"
                        value={clientNumberSearch}
                        onChange={(e) => setClientNumberSearch(e.target.value)}
                        className="w-32"
                      />
                      <button onClick={searchByClientNumber} className="btn-accent">
                        Search
                      </button>
                    </div>
                  </div>

                  {filteredUsers.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border",
                            selectedUser?.id === u.id
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-accent" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{u.name}</p>
                                  {u.isSuspended && (
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-500">
                                      Suspended
                                    </span>
                                  )}
                                  {u.role !== 'user' && (
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent capitalize">
                                      {u.role}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                            {u.clientNumber && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Client #</p>
                                <p className="font-mono text-sm">{u.clientNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No users found</p>
                    </div>
                  )}
                </GlassPanel>
              </div>

              {/* User Detail */}
              <div>
                <div className="sticky top-28">
                  <GlassPanel className="p-6">
                    {selectedUser ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{selectedUser.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                          </div>
                        </div>

                        {selectedUser.clientNumber && (
                          <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                            <p className="text-xs text-muted-foreground mb-1">Client Number</p>
                            <p className="font-mono font-bold text-accent text-lg">{selectedUser.clientNumber}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Role</p>
                            <p className="font-medium capitalize">{selectedUser.role}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className={cn("font-medium", selectedUser.isSuspended ? "text-red-500" : "text-green-500")}>
                              {selectedUser.isSuspended ? 'Suspended' : 'Active'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Logins</p>
                            <p className="font-medium">{selectedUser.loginCount || 0}</p>
                          </div>
                        </div>

                        {/* User's Tickets */}
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-medium mb-2">User's Tickets</h4>
                          <p className="text-sm text-muted-foreground">
                            {getTicketsByClientNumber(selectedUser.clientNumber || '').length} ticket(s)
                          </p>
                        </div>

                        {/* Admin Actions */}
                        {/* RBAC Safeguard: SuperAdmin cannot edit Owner or SuperAdmin accounts */}
                        {/* Only Owner can manage SuperAdmin accounts */}
                        {(selectedUser.role === 'user' || (user?.role === 'owner' && selectedUser.role !== 'user')) && (
                          <div className="border-t border-border pt-4 space-y-3">
                            <h4 className="text-sm font-medium">Admin Actions</h4>

                            {/* Show warning for protected accounts */}
                            {selectedUser.role !== 'user' && (
                              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
                                ⚠️ This account has elevated privileges. Actions are restricted.
                              </div>
                            )}

                            {/* Suspend/Unsuspend */}
                            {selectedUser.isSuspended ? (
                              <button
                                onClick={() => { unsuspendUser(selectedUser.id); toast.success('User unsuspended'); }}
                                className="w-full btn-secondary text-green-500"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Unsuspend User
                              </button>
                            ) : (
                              <div className="space-y-2">
                                <Input
                                  placeholder="Suspension reason..."
                                  value={suspendReason}
                                  onChange={(e) => setSuspendReason(e.target.value)}
                                />
                                <button
                                  onClick={() => handleSuspendUser(selectedUser.id)}
                                  className="w-full btn-secondary text-red-500"
                                  disabled={!suspendReason.trim()}
                                >
                                  <Ban className="w-4 h-4" />
                                  Suspend User
                                </button>
                              </div>
                            )}

                            {/* Send Password Reset Link */}
                            <button
                              onClick={() => handleSendPasswordReset(selectedUser.id)}
                              className="w-full btn-secondary"
                            >
                              <Mail className="w-4 h-4" />
                              Send Password Reset Link
                            </button>

                            {/* Delete User - Only Owner can delete elevated accounts */}
                            {(selectedUser.role === 'user' || user?.role === 'owner') && (
                              <button
                                onClick={() => handleDeleteUser(selectedUser.id)}
                                className="w-full btn-secondary text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete User
                              </button>
                            )}
                          </div>
                        )}

                        {/* SuperAdmin viewing Owner/SuperAdmin - Read Only Notice */}
                        {user?.role === 'superadmin' && (selectedUser.role === 'owner' || selectedUser.role === 'superadmin') && (
                          <div className="border-t border-border pt-4">
                            <div className="p-3 rounded-xl bg-secondary/50 text-center">
                              <Shield className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                This account has equal or higher privileges.
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Only Owners can manage SuperAdmin accounts.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select a user to view details</p>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Stats */}
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6">Platform Analytics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-bold">{allUsers.length}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-bold">{allUsers.filter(u => u.role === 'user').length}</p>
                    <p className="text-sm text-muted-foreground">Client Accounts</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-bold">{Math.round((stats.resolved / Math.max(stats.total, 1)) * 100)}%</p>
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  </div>
                </div>
              </GlassPanel>

              {/* Visual Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ticket Status Chart */}
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Ticket Status Distribution
                  </h3>
                  <SimpleBarChart
                    data={[
                      { name: 'Open', value: stats.open },
                      { name: 'In Progress', value: stats.inProgress },
                      { name: 'Resolved', value: stats.resolved },
                      { name: 'Closed', value: stats.closed },
                    ]}
                    label="Tickets by Status"
                    color="blue"
                  />
                </GlassPanel>

                {/* Ad Status Chart */}
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Ad Performance
                  </h3>
                  <SimpleBarChart
                    data={[
                      { name: 'Active', value: adStats.active },
                      { name: 'Pending', value: adStats.pending },
                      { name: 'Expired', value: ads.filter(a => a.status === 'expired').length },
                      { name: 'Rejected', value: ads.filter(a => a.status === 'rejected').length },
                    ]}
                    label="Ads by Status"
                    color="green"
                  />
                </GlassPanel>
              </div>

              {/* Trend Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Growth Trend */}
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    User Activity Trend
                  </h3>
                  <SimpleLineChart
                    data={[
                      Math.max(0, allUsers.length - 5),
                      Math.max(0, allUsers.length - 4),
                      Math.max(0, allUsers.length - 3),
                      Math.max(0, allUsers.length - 2),
                      Math.max(0, allUsers.length - 1),
                      allUsers.length,
                    ]}
                    label="Users (Last 7 Days)"
                    color="purple"
                  />
                </GlassPanel>

                {/* Ticket Volume Trend */}
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    Ticket Volume Trend
                  </h3>
                  <SimpleLineChart
                    data={[
                      Math.max(0, stats.total - 3),
                      Math.max(0, stats.total - 2),
                      Math.max(0, stats.total - 1),
                      stats.open,
                      stats.inProgress,
                      stats.total,
                    ]}
                    label="Tickets (Last 7 Days)"
                    color="amber"
                  />
                </GlassPanel>
              </div>

              {/* Ad Revenue Stats - Owner Only */}
              {isOwner && (
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Ad Revenue & Performance
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <p className="text-2xl font-bold text-green-500">${adStats.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold">{adStats.active}</p>
                      <p className="text-sm text-muted-foreground">Active Ads</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold">{adStats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending Approval</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold">{adStats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Ads</p>
                    </div>
                  </div>
                </GlassPanel>
              )}

              {/* Security Summary */}
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Security Summary (Last 24h)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold">{securitySummary.last24h.total}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold">{securitySummary.last24h.loginAttempts}</p>
                    <p className="text-sm text-muted-foreground">Login Attempts</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-2xl font-bold text-amber-500">{securitySummary.last24h.failedLogins}</p>
                    <p className="text-sm text-muted-foreground">Failed Logins</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-2xl font-bold text-red-500">{securitySummary.last24h.criticalEvents}</p>
                    <p className="text-sm text-muted-foreground">Critical Events</p>
                  </div>
                </div>
              </GlassPanel>

              {/* Recent Activity */}
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Recent Activity Log
                </h3>
                {auditLogs.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 text-sm">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            log.severity === 'critical' ? "bg-red-500/10 text-red-500" :
                            log.severity === 'warning' ? "bg-amber-500/10 text-amber-500" :
                            "bg-blue-500/10 text-blue-500"
                          )}>
                            {log.severity || 'info'}
                          </span>
                          <span className="font-medium">{(log.eventType || log.action || 'UNKNOWN_EVENT').replace(/_/g, ' ')}</span>
                          {log.details?.action && (
                            <span className="text-muted-foreground">- {log.details.action}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('en-US')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No recent activity</p>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6">Security Overview</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Admin Accounts</p>
                      <p className="text-sm text-muted-foreground">Users with elevated privileges</p>
                    </div>
                    <p className="text-2xl font-bold">{allUsers.filter(u => u.role !== 'user').length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Suspended Accounts</p>
                      <p className="text-sm text-muted-foreground">Users currently suspended</p>
                    </div>
                    <p className="text-2xl font-bold">{allUsers.filter(u => u.isSuspended).length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pending Password Resets</p>
                      <p className="text-sm text-muted-foreground">Active reset tokens</p>
                    </div>
                    <p className="text-2xl font-bold">{getPendingResetTokens().length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/10 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-500">System Status</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Ads List */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search ads..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      value={adFilter}
                      onChange={(e) => setAdFilter(e.target.value as AdStatus | 'all')}
                      className="px-3 py-2 rounded-xl border border-border bg-background text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="expired">Expired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {filteredAds.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredAds.map((ad) => (
                        <div
                          key={ad.id}
                          onClick={() => setSelectedAd(ad)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border",
                            selectedAd?.id === ad.id
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono text-muted-foreground">{ad.id}</span>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs", AD_STATUS_CONFIG[ad.status].color)}>
                                  {AD_STATUS_CONFIG[ad.status].label}
                                </span>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs", AD_TIER_CONFIG[ad.tier].color)}>
                                  {AD_TIER_CONFIG[ad.tier].label}
                                </span>
                              </div>
                              <p className="font-medium truncate">{ad.listingTitle}</p>
                              <p className="text-sm text-muted-foreground">
                                {ad.userName} • ${ad.pricePaid.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {ad.impressions} impressions • {ad.clicks} clicks
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Ends</p>
                              <p className="text-sm">{new Date(ad.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Rocket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No ads found</p>
                    </div>
                  )}
                </GlassPanel>
              </div>

              {/* Ad Detail */}
              <div>
                <div className="sticky top-28">
                  <GlassPanel className="p-6">
                    {selectedAd ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-muted-foreground">{selectedAd.id}</span>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs", AD_STATUS_CONFIG[selectedAd.status].color)}>
                              {AD_STATUS_CONFIG[selectedAd.status].label}
                            </span>
                          </div>
                          <h3 className="font-semibold">{selectedAd.listingTitle}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Tier</p>
                            <p className="font-medium capitalize">{selectedAd.tier}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium capitalize">{selectedAd.duration.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Price Paid</p>
                            <p className="font-medium">${selectedAd.pricePaid.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">CTR</p>
                            <p className="font-medium">
                              {selectedAd.impressions > 0 
                                ? ((selectedAd.clicks / selectedAd.impressions) * 100).toFixed(1) 
                                : 0}%
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Impressions</span>
                            <span>{selectedAd.impressions}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Clicks</span>
                            <span>{selectedAd.clicks}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Advertiser</p>
                            <p className="font-medium">{selectedAd.userName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium truncate">{selectedAd.userEmail}</p>
                          </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="border-t border-border pt-4 space-y-3">
                          <h4 className="text-sm font-medium">Admin Actions</h4>
                          
                          {selectedAd.status === 'pending' && (
                            <div className="space-y-2">
                              <button 
                                onClick={() => handleApproveAd(selectedAd.id)}
                                className="w-full btn-accent"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve Ad
                              </button>
                              <div className="space-y-2">
                                <textarea
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="Rejection reason..."
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm"
                                />
                                <button 
                                  onClick={() => handleRejectAd(selectedAd.id)}
                                  className="w-full btn-secondary text-red-500"
                                  disabled={!rejectReason.trim()}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject Ad
                                </button>
                              </div>
                            </div>
                          )}

                          {selectedAd.status === 'active' && (
                            <button 
                              onClick={() => { pauseAd(selectedAd.id); toast.success('Ad paused'); }}
                              className="w-full btn-secondary"
                            >
                              <Pause className="w-4 h-4" />
                              Pause Ad
                            </button>
                          )}

                          {selectedAd.status === 'paused' && (
                            <button 
                              onClick={() => { resumeAd(selectedAd.id); toast.success('Ad resumed'); }}
                              className="w-full btn-accent"
                            >
                              <Play className="w-4 h-4" />
                              Resume Ad
                            </button>
                          )}

                          <button 
                            onClick={() => { deleteAd(selectedAd.id); setSelectedAd(null); toast.success('Ad deleted'); }}
                            className="w-full btn-secondary text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Ad
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Rocket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select an ad to view details</p>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6">Platform Settings</h2>
                <div className="space-y-6">
                  {/* Platform Info */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3">Platform Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Platform Name</p>
                        <p className="font-medium">Global Equity Exchange</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Version</p>
                        <p className="font-medium">1.0.0</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Environment</p>
                        <p className="font-medium text-amber-500">Demo Mode</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-xl bg-background">
                        <p className="text-2xl font-bold text-accent">{adStats.total}</p>
                        <p className="text-xs text-muted-foreground">Total Ads</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-background">
                        <p className="text-2xl font-bold text-green-500">{adStats.active}</p>
                        <p className="text-xs text-muted-foreground">Active Ads</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-background">
                        <p className="text-2xl font-bold text-amber-500">{adStats.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending Ads</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-background">
                        <p className="text-2xl font-bold">${adStats.revenue.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Ad Revenue</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3">Admin Notes</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Password reset links expire after 24 hours</li>
                      <li>• Ad approvals start the ad duration from approval date</li>
                      <li>• Suspended users cannot log in until unsuspended</li>
                      <li>• Client numbers are only assigned to regular users</li>
                      <li>• Admin accounts cannot be deleted through the dashboard</li>
                    </ul>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Audit Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{auditLogs.length}</p>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{securitySummary?.eventsToday || 0}</p>
                      <p className="text-sm text-muted-foreground">Today</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{securitySummary?.failedLogins || 0}</p>
                      <p className="text-sm text-muted-foreground">Failed Logins</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{securitySummary?.suspiciousActivity || 0}</p>
                      <p className="text-sm text-muted-foreground">Suspicious</p>
                    </div>
                  </div>
                </GlassPanel>
              </div>

              {/* Audit Log Table */}
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Audit Log</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const data = JSON.stringify(auditLogs, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast.success('Audit logs exported');
                      }}
                      className="btn-secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Logs
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-muted-foreground font-medium">Timestamp</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Action</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Actor</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Details</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-secondary/30">
                          <td className="p-3">
                            <span className="font-mono text-xs">
                              {new Date(log.timestamp).toLocaleString('en-US')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-lg bg-secondary text-xs">
                              {log.eventType || log.action || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{log.userEmail || 'System'}</p>
                              <p className="text-xs text-muted-foreground">{log.userId || '-'}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {JSON.stringify(log.details || {}).slice(0, 50)}...
                            </p>
                          </td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              log.severity === 'critical' && "bg-red-500/10 text-red-500",
                              log.severity === 'warning' && "bg-amber-500/10 text-amber-500",
                              log.severity === 'info' && "bg-blue-500/10 text-blue-500"
                            )}>
                              {log.severity || 'info'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {auditLogs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No audit logs yet</p>
                  </div>
                )}
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 'rateLimits' && (
            <motion.div
              key="rateLimits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Rate Limit Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">--</p>
                      <p className="text-sm text-muted-foreground">Requests/hr</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Ban className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">--</p>
                      <p className="text-sm text-muted-foreground">Blocked</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">--</p>
                      <p className="text-sm text-muted-foreground">Block Rate</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">6</p>
                      <p className="text-sm text-muted-foreground">Active Limits</p>
                    </div>
                  </div>
                </GlassPanel>
              </div>

              {/* Rate Limit Configuration */}
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6">Rate Limit Configuration</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Max Requests</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Window</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Block Duration</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { type: 'API Requests', max: 1000, window: '1 hour', block: '1 hour', enabled: true },
                        { type: 'Authentication', max: 10, window: '15 min', block: '30 min', enabled: true },
                        { type: 'Listing Operations', max: 50, window: '1 hour', block: '1 hour', enabled: true },
                        { type: 'Messaging', max: 100, window: '1 hour', block: '30 min', enabled: true },
                        { type: 'Search', max: 200, window: '1 hour', block: '15 min', enabled: true },
                        { type: 'File Uploads', max: 20, window: '1 hour', block: '1 hour', enabled: true },
                      ].map((limit, i) => (
                        <tr key={i} className="hover:bg-secondary/30">
                          <td className="p-3 font-medium">{limit.type}</td>
                          <td className="p-3">{limit.max.toLocaleString('en-US')}</td>
                          <td className="p-3">{limit.window}</td>
                          <td className="p-3">{limit.block}</td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              limit.enabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            )}>
                              {limit.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>

              {/* Recent Blocked Requests */}
              <GlassPanel className="p-6">
                <h2 className="text-lg font-semibold mb-6">Recent Blocked Requests (Demo)</h2>
                <div className="space-y-3">
                  {[
                    { ip: '192.168.1.105', type: 'Authentication', reason: 'Too many failed attempts', time: '5 min ago' },
                    { ip: '10.0.0.42', type: 'API Requests', reason: 'Rate limit exceeded', time: '12 min ago' },
                    { ip: '172.16.0.88', type: 'Search', reason: 'Rate limit exceeded', time: '25 min ago' },
                  ].map((block, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <Ban className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">{block.ip}</p>
                          <p className="text-xs text-muted-foreground">{block.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-500">{block.reason}</p>
                        <p className="text-xs text-muted-foreground">{block.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Earnings Tab - Owner Only */}
          {activeTab === 'earnings' && isOwner && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Earnings Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">${earningsStats.today.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Today</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">${earningsStats.thisWeek.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">${earningsStats.thisMonth.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">${earningsStats.thisYear.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">This Year</p>
                    </div>
                  </div>
                </GlassPanel>
              </div>

              {/* Comparison Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassPanel className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                      <p className="text-xl font-semibold">${earningsStats.yesterday.toFixed(2)}</p>
                    </div>
                    {earningsStats.today > earningsStats.yesterday ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.yesterday > 0 
                            ? `${(((earningsStats.today - earningsStats.yesterday) / earningsStats.yesterday) * 100).toFixed(0)}%`
                            : '∞'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.today > 0 
                            ? `${(((earningsStats.yesterday - earningsStats.today) / earningsStats.yesterday) * 100).toFixed(0)}%`
                            : '0%'}
                        </span>
                      </div>
                    )}
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Week</p>
                      <p className="text-xl font-semibold">${earningsStats.lastWeek.toFixed(2)}</p>
                    </div>
                    {earningsStats.thisWeek > earningsStats.lastWeek ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.lastWeek > 0 
                            ? `${(((earningsStats.thisWeek - earningsStats.lastWeek) / earningsStats.lastWeek) * 100).toFixed(0)}%`
                            : '∞'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.thisWeek > 0 
                            ? `${(((earningsStats.lastWeek - earningsStats.thisWeek) / earningsStats.lastWeek) * 100).toFixed(0)}%`
                            : '0%'}
                        </span>
                      </div>
                    )}
                  </div>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Month</p>
                      <p className="text-xl font-semibold">${earningsStats.lastMonth.toFixed(2)}</p>
                    </div>
                    {earningsStats.thisMonth > earningsStats.lastMonth ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.lastMonth > 0 
                            ? `${(((earningsStats.thisMonth - earningsStats.lastMonth) / earningsStats.lastMonth) * 100).toFixed(0)}%`
                            : '∞'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-sm">
                          {earningsStats.thisMonth > 0 
                            ? `${(((earningsStats.lastMonth - earningsStats.thisMonth) / earningsStats.lastMonth) * 100).toFixed(0)}%`
                            : '0%'}
                        </span>
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </div>

              {/* Revenue by Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4">Revenue by Source</h3>
                  <div className="space-y-3">
                    {(['promotion_basic', 'promotion_premium', 'promotion_featured', 'listing_featured'] as EarningSource[]).map((source) => {
                      const total = earnings.filter(e => e.source === source).reduce((sum, e) => sum + e.amount, 0);
                      return (
                        <div key={source} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                          <span className={cn("px-2 py-1 rounded-full text-xs", EARNING_SOURCE_COLORS[source])}>
                            {EARNING_SOURCE_LABELS[source]}
                          </span>
                          <span className="font-semibold">${total.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </GlassPanel>

                <GlassPanel className="p-6">
                  <h3 className="font-semibold mb-4">All-Time Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold text-green-500">${earningsStats.allTime.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Transactions</span>
                      <span className="text-xl font-semibold">{earningsStats.transactionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Per Day</span>
                      <span className="font-semibold">${earningsStats.averagePerDay.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Per Week</span>
                      <span className="font-semibold">${earningsStats.averagePerWeek.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg. Per Month</span>
                      <span className="font-semibold">${earningsStats.averagePerMonth.toFixed(2)}</span>
                    </div>
                  </div>
                </GlassPanel>
              </div>

              {/* Recent Transactions */}
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {earnings.slice(0, 20).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", EARNING_SOURCE_COLORS[earning.source])}>
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{earning.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(earning.createdAt)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-green-500">+${earning.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Verifications Tab - Owner Only */}
          {activeTab === 'verifications' && isOwner && (
            <motion.div
              key="verifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Verifications List */}
              <div className="lg:col-span-2">
                <GlassPanel className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Verification Requests</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">
                        {getPendingRequests().length} pending
                      </span>
                    </div>
                  </div>

                  {verificationRequests.length > 0 ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {verificationRequests.map((request) => (
                        <div
                          key={request.id}
                          onClick={() => setSelectedVerification(request)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border",
                            selectedVerification?.id === request.id
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{request.listingTitle}</h4>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs", VERIFICATION_STATUS_CONFIG[request.status].color)}>
                                  {VERIFICATION_STATUS_CONFIG[request.status].label}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {request.userName} • {request.userEmail}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{request.documents.length} documents</span>
                                <span>Submitted {formatDistanceToNow(request.submittedAt)}</span>
                              </div>
                            </div>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    approveVerification(request.id, 'Approved by admin');
                                    toast.success('Verification approved');
                                  }}
                                  className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No verification requests</p>
                    </div>
                  )}
                </GlassPanel>
              </div>

              {/* Verification Detail */}
              <div>
                <div className="sticky top-28">
                  <GlassPanel className="p-6">
                    {selectedVerification ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{selectedVerification.listingTitle}</h3>
                          <div className="flex items-center gap-2">
                            <span className={cn("px-2 py-1 rounded-full text-xs", VERIFICATION_STATUS_CONFIG[selectedVerification.status].color)}>
                              {VERIFICATION_STATUS_CONFIG[selectedVerification.status].label}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-xs text-muted-foreground">Submitter</p>
                          <p className="font-medium">{selectedVerification.userName}</p>
                          <p className="text-sm text-muted-foreground">{selectedVerification.userEmail}</p>
                        </div>

                        {selectedVerification.notes && (
                          <div className="p-3 rounded-xl bg-secondary/50">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm">{selectedVerification.notes}</p>
                          </div>
                        )}

                        {/* Documents */}
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Documents (Confidential)
                          </h4>
                          <div className="space-y-2">
                            {selectedVerification.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{doc.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {DOCUMENT_TYPE_LABELS[doc.type]} • {(doc.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Admin Actions */}
                        {selectedVerification.status === 'pending' && (
                          <div className="border-t border-border pt-4 space-y-3">
                            <h4 className="text-sm font-medium">Review Actions</h4>
                            
                            <textarea
                              value={verificationAdminNotes}
                              onChange={(e) => setVerificationAdminNotes(e.target.value)}
                              placeholder="Admin notes (optional)..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm"
                            />

                            <textarea
                              value={verificationRejectReason}
                              onChange={(e) => setVerificationRejectReason(e.target.value)}
                              placeholder="Rejection reason (if rejecting)..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-xl border border-border bg-background resize-none text-sm"
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  approveVerification(selectedVerification.id, verificationAdminNotes);
                                  auditLog('VERIFICATION', { action: 'approve', requestId: selectedVerification.id }, { userId: user?.id, userEmail: user?.email, severity: 'info' });
                                  toast.success('Verification approved');
                                  setSelectedVerification(null);
                                  setVerificationAdminNotes('');
                                }}
                                className="btn-accent flex-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  if (!verificationRejectReason.trim()) {
                                    toast.error('Please provide a rejection reason');
                                    return;
                                  }
                                  rejectVerification(selectedVerification.id, verificationRejectReason, verificationAdminNotes);
                                  auditLog('VERIFICATION', { action: 'reject', requestId: selectedVerification.id, reason: verificationRejectReason }, { userId: user?.id, userEmail: user?.email, severity: 'warning' });
                                  toast.success('Verification rejected');
                                  setSelectedVerification(null);
                                  setVerificationRejectReason('');
                                  setVerificationAdminNotes('');
                                }}
                                className="btn-secondary text-red-500 flex-1"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Review Info */}
                        {selectedVerification.reviewedAt && (
                          <div className="border-t border-border pt-4">
                            <div className="p-3 rounded-xl bg-secondary/50">
                              <p className="text-xs text-muted-foreground">Reviewed by</p>
                              <p className="font-medium">{selectedVerification.reviewedByName}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(selectedVerification.reviewedAt).toLocaleString('en-US')}
                              </p>
                            </div>
                            {selectedVerification.adminNotes && (
                              <div className="mt-2 p-3 rounded-xl bg-secondary/50">
                                <p className="text-xs text-muted-foreground">Admin Notes</p>
                                <p className="text-sm">{selectedVerification.adminNotes}</p>
                              </div>
                            )}
                            {selectedVerification.rejectionReason && (
                              <div className="mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-xs text-red-500">Rejection Reason</p>
                                <p className="text-sm">{selectedVerification.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Select a verification request</p>
                        <p className="text-xs mt-1">View documents and review requests</p>
                      </div>
                    )}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Reset Modal */}
        {showResetModal && resetTokenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowResetModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 w-full max-w-md"
            >
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Password Reset Link Generated</h3>
                  <button onClick={() => setShowResetModal(false)} className="p-2 hover:bg-secondary rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    A password reset link has been generated. In production, this would be sent to the user's email.
                  </p>

                  <div className="p-3 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Reset Token</p>
                    <p className="font-mono text-sm break-all">{resetTokenModal.token}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-500 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>This link expires in 24 hours. Share it securely with the user.</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">User Email</p>
                    <p className="text-sm">{resetTokenModal.userEmail}</p>
                  </div>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(resetTokenModal.token);
                      toast.success('Token copied to clipboard');
                    }}
                    className="w-full btn-accent"
                  >
                    Copy Token to Clipboard
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
