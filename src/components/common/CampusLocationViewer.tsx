import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { KITSW_CENTER, findCampusBlock } from '../../services/campusLocations';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface CampusLocationViewerProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export const CampusLocationViewer: React.FC<CampusLocationViewerProps> = ({
  location,
  latitude,
  longitude,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const blockInfo = findCampusBlock(location);
  const lat = latitude ?? blockInfo?.lat ?? KITSW_CENTER.lat;
  const lng = longitude ?? blockInfo?.lng ?? KITSW_CENTER.lng;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 17,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      });

      tileLayer.on('load', () => setIsLoading(false));
      tileLayer.on('tileerror', () => setIsLoading(false));
      tileLayer.addTo(map);

      // Custom Pin Icon
      const pinIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="position: relative; width: 34px; height: 42px; transform: translate(-50%, -100%);">
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.2 14.875 40.8 15.5109 41.3781C15.9388 41.7675 16.4694 41.979 17 41.979C17.5306 41.979 18.0612 41.7675 18.4891 41.3781C19.125 40.8 34 27.2 34 17C34 7.61116 26.3888 0 17 0Z" fill="#174B3A"/>
              <circle cx="17" cy="16" r="7.5" fill="#FFFEFA"/>
              <circle cx="17" cy="16" r="4" fill="#DCE7D8"/>
            </svg>
          </div>
        `,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`<b>${location}</b><br/>KITSW Warangal`).openPopup();

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    } catch (err) {
      console.error('Error rendering CampusLocationViewer map:', err);
      setTimeout(() => setIsLoading(false), 0);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, location]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#72766F]">
        <span className="font-semibold text-[#242923] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#174B3A]" /> Campus Location & Coordinates
        </span>
        <span className="font-mono text-[11px]">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>

      <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-[#E5E2D9] bg-[#E8ECE9]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {isLoading && (
          <div className="absolute inset-0 z-20 bg-[#F7F5EF]/80 backdrop-blur-2xs flex items-center justify-center gap-2 text-xs font-semibold text-[#174B3A]">
            <Loader2 className="w-4 h-4 animate-spin text-[#174B3A]" />
            <span>Loading campus map...</span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 z-20 bg-[#FFFEFA]/95 backdrop-blur-xs border border-[#E5E2D9] rounded-lg px-2.5 py-1 text-[11px] text-[#242923] flex items-center gap-1">
          <Navigation className="w-3 h-3 text-[#174B3A]" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
