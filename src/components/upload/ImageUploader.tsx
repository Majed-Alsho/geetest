'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, Image as ImageIcon, Plus, Star, 
  Loader2, AlertCircle, Move, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ImageFile {
  id: string;
  url: string; // Base64 data URL
  file?: File;
  caption?: string;
  isPrimary: boolean;
  order: number;
  size: number;
  uploading?: boolean;
  error?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in bytes
  acceptedFormats?: string[];
  disabled?: boolean;
  showCaptions?: boolean;
  className?: string;
}

const DEFAULT_MAX_IMAGES = 10;
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUploader({
  images = [],
  onChange,
  maxImages = DEFAULT_MAX_IMAGES,
  maxSizePerImage = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_FORMATS,
  disabled = false,
  showCaptions = true,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid format. Accepted: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }
    if (file.size > maxSizePerImage) {
      return `File too large. Max size: ${(maxSizePerImage / 1024 / 1024).toFixed(0)}MB`;
    }
    return null;
  };

  const processFile = async (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        resolve({
          id,
          url: e.target?.result as string,
          file,
          caption: '',
          isPrimary: false,
          order: images.length,
          size: file.size,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: ImageFile[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
        continue;
      }

      try {
        const imageFile = await processFile(file);
        newImages.push(imageFile);
      } catch (err) {
        errors.push(`${file.name}: Failed to process`);
      }
    }

    if (errors.length > 0) {
      toast.error(errors[0]); // Show first error
    }

    if (newImages.length > 0) {
      // Set first image as primary if no primary exists
      const hasPrimary = images.some(img => img.isPrimary);
      if (!hasPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }

      const updatedImages = [...images, ...newImages].map((img, idx) => ({
        ...img,
        order: idx,
      }));
      onChange(updatedImages);
    }
  }, [images, maxImages, onChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images
      .filter(img => img.id !== id)
      .map((img, idx) => ({ ...img, order: idx }));
    
    // If removed image was primary, make first image primary
    const removedWasPrimary = images.find(img => img.id === id)?.isPrimary;
    if (removedWasPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onChange(updatedImages);
  };

  const setPrimary = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(updatedImages);
  };

  const updateCaption = (id: string, caption: string) => {
    const updatedImages = images.map(img =>
      img.id === id ? { ...img, caption } : img
    );
    onChange(updatedImages);
  };

  const moveImage = (id: string, direction: 'left' | 'right') => {
    const index = images.findIndex(img => img.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    
    const updatedImages = [...images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    
    // Update order
    updatedImages.forEach((img, idx) => {
      img.order = idx;
    });
    
    onChange(updatedImages);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-secondary/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mb-4",
              isDragging ? "bg-accent/10" : "bg-secondary"
            )}>
              {isDragging ? (
                <Upload className="w-7 h-7 text-accent" />
              ) : (
                <ImageIcon className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
            
            <p className="font-medium mb-1">
              {isDragging ? 'Drop images here' : 'Drag and drop images'}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              or click to browse
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-secondary">
                Up to {maxImages} images
              </span>
              <span className="px-2 py-1 rounded-full bg-secondary">
                Max {(maxSizePerImage / 1024 / 1024).toFixed(0)}MB each
              </span>
              <span className="px-2 py-1 rounded-full bg-secondary">
                {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images
            .sort((a, b) => a.order - b.order)
            .map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square"
              >
                {/* Image */}
                <div className={cn(
                  "relative w-full h-full rounded-xl overflow-hidden border-2 transition-all",
                  image.isPrimary
                    ? "border-accent shadow-lg shadow-accent/20"
                    : "border-transparent hover:border-border"
                )}>
                  <img
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs text-white/80 truncate">
                        {formatSize(image.size)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Primary
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!image.isPrimary && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimary(image.id);
                        }}
                        className="p-1.5 rounded-lg bg-secondary/90 hover:bg-secondary text-foreground backdrop-blur-sm"
                        title="Set as primary"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="p-1.5 rounded-lg bg-destructive/90 hover:bg-destructive text-destructive-foreground backdrop-blur-sm"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Move buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(image.id, 'left');
                        }}
                        className="p-1.5 rounded-lg bg-secondary/90 hover:bg-secondary backdrop-blur-sm"
                        title="Move left"
                      >
                        <Move className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(image.id, 'right');
                        }}
                        className="p-1.5 rounded-lg bg-secondary/90 hover:bg-secondary backdrop-blur-sm"
                        title="Move right"
                      >
                        <Move className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          
          {/* Add More Button */}
          {canAddMore && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-secondary/30 transition-all flex items-center justify-center"
            >
              <Plus className="w-8 h-8 text-muted-foreground" />
            </motion.button>
          )}
        </div>
      )}

      {/* Caption Inputs */}
      {showCaptions && images.length > 0 && (
        <div className="space-y-2">
          {images
            .filter(img => img.isPrimary)
            .map(image => (
              <input
                key={image.id}
                type="text"
                placeholder="Add a caption for the primary image..."
                value={image.caption || ''}
                onChange={(e) => updateCaption(image.id, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
                disabled={disabled}
              />
            ))}
        </div>
      )}

      {/* Error state */}
      {images.some(img => img.error) && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">Some images failed to upload</p>
        </div>
      )}
    </div>
  );
}

// Simple avatar uploader variant
export function AvatarUploader({
  value,
  onChange,
  disabled = false,
  className,
}: {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Invalid format. Use JPG, PNG, WebP, or GIF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB for avatar
      toast.error('File too large. Max 10MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn("relative group cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className={cn(
        "w-24 h-24 rounded-full overflow-hidden border-2 transition-all",
        isHovered && !disabled ? "border-accent" : "border-border"
      )}>
        {value ? (
          <img src={value} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {/* Overlay on hover */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
