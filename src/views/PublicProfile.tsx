'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Globe, MapPin, Briefcase, Building2,
  Calendar, Star, Eye, Heart, Share2, MessageCircle,
  ExternalLink, Linkedin, Twitter, Facebook, Instagram
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PublicUserData {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  location: string | null;
  website: string | null;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  } | null;
  createdAt: string;
  preferences?: {
    showProfile?: boolean;
    showContactInfo?: boolean;
  };
}

interface PublicListing {
  id: string;
  title: string;
  category: string;
  region: string;
  location: string;
  askingPrice: number;
  revenue: number;
  images: string | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
}

export default function PublicProfileView({ userId }: { userId: string }) {
  const [user, setUser] = useState<PublicUserData | null>(null);
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user data
      const userResponse = await fetch(`/api/users/${userId}/public`);
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          setError('User not found');
        } else if (userResponse.status === 403) {
          setError('This profile is private');
        } else {
          setError('Failed to load profile');
        }
        return;
      }
      
      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.data);
        
        // Fetch user's listings
        const listingsResponse = await fetch(`/api/users/${userId}/listings`);
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          if (listingsData.success) {
            setListings(listingsData.data);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="section-padding min-h-[80vh]">
        <div className="container-narrow">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-secondary rounded-xl" />
            <div className="h-24 bg-secondary rounded-xl" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center">
        <GlassPanel className="p-8 text-center max-w-md">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">
            {error === 'User not found' ? 'User Not Found' : 
             error === 'This profile is private' ? 'Private Profile' : 'Error'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || 'Could not load this profile'}
          </p>
          <Link href="/marketplace" className="btn-accent">
            Browse Marketplace
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const showContact = user.preferences?.showContactInfo;
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="section-padding min-h-[80vh]">
      <div className="container-narrow">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-accent" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold mb-1">{user.name}</h1>
                
                {user.company && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{user.company}</span>
                    {user.jobTitle && <span>• {user.jobTitle}</span>}
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.bio && (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {joinDate}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    {listings.length} listing{listings.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {showContact && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h3>
                <div className="flex flex-wrap gap-4">
                  {user.socialLinks?.linkedin && (
                    <a 
                      href={user.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a 
                      href={user.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {user.socialLinks?.facebook && (
                    <a 
                      href={user.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {user.socialLinks?.instagram && (
                    <a 
                      href={user.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Listings by {user.name}</h2>
            <span className="text-sm text-muted-foreground">
              {listings.length} active listing{listings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link href={`/listings/${listing.id}`}>
                    <GlassPanel className="p-4 hover:border-accent/50 transition-all">
                      {/* Image */}
                      <div className="aspect-video rounded-lg bg-secondary mb-3 overflow-hidden">
                        {listing.images ? (
                          <img 
                            src={JSON.parse(listing.images)[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <h3 className="font-semibold mb-1 truncate">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {listing.category} • {listing.region}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-accent">
                          {formatCurrency(listing.askingPrice)}
                        </span>
                        {listing.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground">
                            Featured
                          </span>
                        )}
                      </div>
                    </GlassPanel>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassPanel className="p-8 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No active listings yet</p>
            </GlassPanel>
          )}
        </motion.div>
      </div>
    </div>
  );
}
