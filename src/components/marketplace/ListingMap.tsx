'use client';

import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issues in Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

interface ListingMapProps {
  latitude: number | null;
  longitude: number | null;
  showExactLocation: boolean;
  locationName?: string;
}

// Custom marker icon
const createMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: #3b82f6;
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// Random offset generator for privacy
const generateRandomOffset = (base: number, maxOffsetKm: number = 2): number => {
  // Convert km to degrees (approximate)
  const offsetDegrees = (maxOffsetKm / 111) * (Math.random() * 2 - 1);
  return base + offsetDegrees;
};

// Component to fit bounds
function FitBounds({ center, radius }: { center: [number, number]; radius: number }) {
  const map = useMap();
  
  useMemo(() => {
    if (center) {
      // Fit the map to show the circle area
      const circleRadiusMeters = radius * 1000; // Convert km to meters
      map.setView(center, Math.max(10, 13 - Math.log2(circleRadiusMeters / 1000)));
    }
  }, [center, radius, map]);
  
  return null;
}

export default function ListingMap({ 
  latitude, 
  longitude, 
  showExactLocation,
  locationName 
}: ListingMapProps) {
  // Fix leaflet icons on mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Handle missing coordinates
  if (!latitude || !longitude) {
    return (
      <div className="w-full h-64 rounded-xl bg-secondary/30 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Location not specified</p>
        </div>
      </div>
    );
  }

  // Calculate display coordinates based on privacy setting
  const displayCoords: [number, number] = useMemo(() => {
    if (showExactLocation) {
      return [latitude, longitude];
    }
    // Apply random offset for privacy
    return [
      generateRandomOffset(latitude, 2),
      generateRandomOffset(longitude, 2),
    ];
  }, [latitude, longitude, showExactLocation]);

  // Circle radius in km for privacy mode
  const privacyRadiusKm = 3;

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={displayCoords}
        zoom={showExactLocation ? 15 : 12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#1a1a2e' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showExactLocation ? (
          // Show exact marker
          <Marker 
            position={[latitude, longitude]}
            icon={createMarkerIcon()}
          />
        ) : (
          // Show privacy circle
          <>
            <Circle
              center={displayCoords}
              radius={privacyRadiusKm * 1000} // Convert to meters
              pathOptions={{
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                color: '#3b82f6',
                weight: 2,
                opacity: 0.6,
              }}
            />
            <FitBounds center={displayCoords} radius={privacyRadiusKm} />
          </>
        )}
      </MapContainer>
      
      {/* Privacy indicator */}
      {!showExactLocation && (
        <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Approximate Location</span>
        </div>
      )}
      
      {/* Location name overlay */}
      {locationName && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{locationName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
