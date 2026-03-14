'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  Info,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Link } from '@/components/Link';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useListings, ListingInput } from '@/contexts/ListingContext';
import { categories, regions, FEATURED_MONTHLY_PRICE, ListingImage } from '@/lib/data';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { LocationPicker, LocationData } from '@/components/location/LocationPicker';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  region: z.string().min(1, 'Please select a region'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  highlights: z.string().min(10, 'Please add at least one highlight'),
  revenue: z.number().min(1, 'Revenue is required'),
  growthYoY: z.number().min(-100).max(1000, 'Growth must be between -100% and 1000%'),
  employees: z.number().min(1, 'Number of employees is required'),
  price: z.number().min(1, 'Asking price is required'),
  ebitdaMargin: z.number().min(0).max(100, 'EBITDA margin must be between 0% and 100%'),
  featured: z.boolean().optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function CreateListing() {
  const { user, isAuthenticated } = useAuth();
  const { navigateTo, selectedListingId } = useNavigation();
  const { createListing, updateListing, getListingById, isLoading: isCreatingListing } = useListings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  // Check if we're editing an existing listing
  const existingListing = selectedListingId ? getListingById(selectedListingId) : null;
  const isEditing = !!existingListing;

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: existingListing?.title || '',
      category: existingListing?.category || '',
      region: existingListing?.region || '',
      location: existingListing?.location || '',
      description: existingListing?.description || '',
      highlights: existingListing?.highlights?.join('\n') || '',
      revenue: existingListing?.revenue || 0,
      growthYoY: existingListing?.growthYoY || 0,
      employees: existingListing?.employees || 1,
      price: existingListing?.price || 0,
      ebitdaMargin: existingListing?.ebitdaMargin || 0,
      featured: existingListing?.featured || false,
    },
  });

  // Initialize images and location from existing listing
  useState(() => {
    if (existingListing) {
      if (existingListing.images) {
        setImages(existingListing.images);
      }
      if (existingListing.coordinates && existingListing.address) {
        setLocationData({
          address: existingListing.address.formattedAddress,
          city: existingListing.address.city,
          state: existingListing.address.state,
          country: existingListing.address.country,
          countryCode: existingListing.address.countryCode,
          postalCode: existingListing.address.postalCode,
          lat: existingListing.coordinates.lat,
          lng: existingListing.coordinates.lng,
          region: existingListing.region,
          formattedAddress: existingListing.address.formattedAddress,
        });
      }
    }
  });

  const watchFeatured = form.watch('featured');

  const onSubmit = async (data: ListingFormData) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a listing');
      navigateTo('login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create listing using the context - this will persist to localStorage
      const listingInput: ListingInput = {
        title: data.title,
        category: data.category as any,
        region: data.region as any,
        location: data.location,
        description: data.description,
        highlights: data.highlights.split('\n').filter(h => h.trim()),
        revenue: data.revenue,
        growthYoY: data.growthYoY,
        employees: data.employees,
        price: data.price,
        ebitdaMargin: data.ebitdaMargin,
        // New fields
        images: images.length > 0 ? images : undefined,
        coordinates: locationData ? { lat: locationData.lat, lng: locationData.lng } : undefined,
        address: locationData ? {
          city: locationData.city,
          country: locationData.country,
          countryCode: locationData.countryCode,
          state: locationData.state,
          postalCode: locationData.postalCode,
          formattedAddress: locationData.formattedAddress,
        } : undefined,
      };
      
      if (isEditing && existingListing) {
        const result = await updateListing(existingListing.id, listingInput, user.id);
        if (result.success) {
          toast.success('Listing updated!', {
            description: `Your listing "${data.title}" has been updated.`,
          });
          navigateTo('profile');
        } else {
          toast.error('Update failed', { description: result.error });
        }
        return;
      }
      
      const newListing = await createListing(listingInput, user.id);
      
      // Dispatch event for admin notifications
      window.dispatchEvent(new CustomEvent('newListing', {
        detail: { listingId: newListing.id, title: newListing.title, userId: user.id, userName: user.name }
      }));
      
      if (data.featured) {
        toast.success('Listing submitted for review!', {
          description: `Your listing "${data.title}" has been submitted. Featured subscription ($${FEATURED_MONTHLY_PRICE}/month) will activate upon approval.`,
        });
      } else {
        toast.success('Listing submitted for review!', {
          description: `Your listing "${data.title}" will be reviewed by our team before being published.`,
        });
      }

      // Navigate to profile to see listing status
      navigateTo('profile');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      
        <section className="section-padding">
          <div className="container-wide text-center">
            <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to create a listing.
            </p>
            <Link to="login" className="btn-primary">
              Log In
            </Link>
          </div>
        </section>
      
    );
  }

  return (
    
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to="marketplace"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {isEditing ? 'Edit Listing' : 'Create a Listing'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditing ? 'Update your business listing details.' : 'List your business opportunity for qualified buyers.'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Images */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    Listing Images
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload up to 10 images of your business. The first image will be used as the primary image.
                  </p>
                  <ImageUploader
                    value={images}
                    onChange={setImages}
                    maxImages={10}
                    maxSizeMB={5}
                  />
                </GlassPanel>

                {/* Basic Info */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    Business Information
                  </h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Premium E-commerce Brand" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select 
                                {...field} 
                                className="w-full px-3 py-2 rounded-xl border border-border bg-background"
                              >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <select 
                                {...field}
                                className="w-full px-3 py-2 rounded-xl border border-border bg-background"
                              >
                                <option value="">Select region</option>
                                {regions.map(reg => (
                                  <option key={reg} value={reg}>{reg}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Location Picker */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <FormLabel>Business Location</FormLabel>
                      </div>
                      <LocationPicker
                        value={locationData}
                        onChange={setLocationData}
                      />
                      {/* Hidden field for form validation */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <input type="hidden" {...field} value={locationData?.formattedAddress || ''} />
                        )}
                      />
                      {locationData && (
                        <p className="text-xs text-muted-foreground">
                          Region automatically set to: <span className="font-medium text-foreground">{locationData.region}</span>
                        </p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your business, its history, and what makes it unique..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="highlights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Highlights (one per line)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Strong customer retention&#10;Proprietary technology&#10;Experienced team"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </GlassPanel>

                {/* Financial Info */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    Financial Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 5000000"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asking Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 15000000"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="growthYoY"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YoY Growth (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 25"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ebitdaMargin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EBITDA Margin (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 20"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </GlassPanel>

                {/* Team Info */}
                <GlassPanel className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Team Information
                  </h2>
                  <FormField
                    control={form.control}
                    name="employees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 25"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </GlassPanel>

                {/* Featured Option */}
                <GlassPanel className={`p-6 transition-colors ${watchFeatured ? 'border-accent bg-accent/5' : ''}`}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Featured Listing (Paid Ad)
                  </h2>
                  <div className="flex items-start gap-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="text-base font-medium cursor-pointer">
                              Feature my listing at the top
                            </FormLabel>
                            <p className="text-sm text-muted-foreground mt-1">
                              Get 10x more visibility with a featured placement. Your listing will appear at the top of search results with a "Featured" badge.
                            </p>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                              <DollarSign className="w-4 h-4 text-accent" />
                              <span className="font-semibold text-accent">${FEATURED_MONTHLY_PRICE}</span>
                              <span className="text-sm text-muted-foreground">/month subscription</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              You can also add this later after your listing is approved.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </GlassPanel>

                {/* Info Notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Review Process</p>
                    <p>All listings are reviewed by our team before being published. This typically takes 1-2 business days. You'll receive an email once your listing is approved and visible in the marketplace.</p>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  type="submit" 
                  className="w-full btn-accent justify-center py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></span>
                      {isEditing ? 'Updating...' : 'Submitting...'}
                    </span>
                  ) : isEditing ? (
                    'Update Listing'
                  ) : watchFeatured ? (
                    `Submit & Subscribe ($${FEATURED_MONTHLY_PRICE}/mo)`
                  ) : (
                    'Submit Listing for Review'
                  )}
                </button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    
  );
}
