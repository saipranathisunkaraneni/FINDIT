import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  KITSW_CENTER,
  KITSW_BLOCKS,
  findCampusBlock,
  findNearestCampusBlock,
  type CampusLocationPoint,
} from '../../services/campusLocations';
import { MapPin, Search, Navigation, AlertCircle, Loader2, Check } from 'lucide-react';

interface CampusLocationPickerProps {
  location: string;
  latitude?: number;
  longitude?: number;
  onChange: (location: string, latitude?: number, longitude?: number) => void;
  error?: string;
}

export const CampusLocationPicker: React.FC<CampusLocationPickerProps> = ({
  location,
  latitude,
  longitude,
  onChange,
  error,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [isLoadingTiles, setIsLoadingTiles] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: latitude ?? KITSW_CENTER.lat,
    lng: longitude ?? KITSW_CENTER.lng,
  });

  // Filter blocks based on search
  const filteredBlocks = KITSW_BLOCKS.filter((block) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      block.name.toLowerCase().includes(q) ||
      block.shortName.toLowerCase().includes(q) ||
      block.description.toLowerCase().includes(q)
    );
  });

  // Custom Forest Green Pin Icon for Leaflet
  const createPinIcon = () => {
    return L.divIcon({
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
  };

  const onChangeRef = useRef(onChange);
  const locationRef = useRef(location);

  useEffect(() => {
    onChangeRef.current = onChange;
    locationRef.current = location;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Guard against multiple initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const initialLat = latitude ?? KITSW_CENTER.lat;
      const initialLng = longitude ?? KITSW_CENTER.lng;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 17,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false, // Prevent page scroll interception on mobile
      });

      // Add OpenStreetMap Tile Layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      tileLayer.on('loading', () => {
        setIsLoadingTiles(true);
      });

      tileLayer.on('load', () => {
        setIsLoadingTiles(false);
      });

      tileLayer.on('tileerror', () => {
        setIsLoadingTiles(false);
        // Do not break the form if tiles are blocked; fallback dropdown is always functional
        setMapError('Map tiles could not be loaded. You can still select your campus location from the list below.');
      });

      tileLayer.addTo(map);

      // Add Initial Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: createPinIcon(),
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`<b>${locationRef.current || 'KITSW Campus'}</b><br/>Drag or click map to move pin.`);

      // Handle marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const nearest = findNearestCampusBlock(pos.lat, pos.lng);
        setCurrentCoords({ lat: pos.lat, lng: pos.lng });
        onChangeRef.current(nearest.name, Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      // Handle map clicks
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        const nearest = findNearestCampusBlock(lat, lng);
        setCurrentCoords({ lat, lng });
        onChangeRef.current(nearest.name, Number(lat.toFixed(6)), Number(lng.toFixed(6)));
        marker.openPopup();
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalidate size after layout mounts to avoid tile distortion
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      setTimeout(() => {
        setMapError('Unable to load interactive map. Please select your location from the list below.');
        setIsLoadingTiles(false);
      }, 0);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  // Sync marker when location / coordinates change externally
  const handleSelectBlock = (block: CampusLocationPoint) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    setCurrentCoords({ lat: block.lat, lng: block.lng });
    onChange(block.name, block.lat, block.lng);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([block.lat, block.lng], 17, { animate: true });
      markerRef.current.setLatLng([block.lat, block.lng]);
      markerRef.current.setPopupContent(`<b>${block.name}</b><br/>${block.description}`).openPopup();
    }
  };

  const handleResetToCenter = () => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([KITSW_CENTER.lat, KITSW_CENTER.lng], 17, { animate: true });
      markerRef.current.setLatLng([KITSW_CENTER.lat, KITSW_CENTER.lng]);
      const nearest = findNearestCampusBlock(KITSW_CENTER.lat, KITSW_CENTER.lng);
      setCurrentCoords({ lat: KITSW_CENTER.lat, lng: KITSW_CENTER.lng });
      onChange(nearest.name, KITSW_CENTER.lat, KITSW_CENTER.lng);
    }
  };

  const activeBlock = findCampusBlock(location);

  return (
    <div className="space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-[#242923] uppercase tracking-wider">
          Campus Location & Pin *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#72766F] font-mono">
            {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
          </span>
          <button
            type="button"
            onClick={handleResetToCenter}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#174B3A] hover:text-[#10372D] bg-[#EBF2ED] px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Reset to KITSW Campus Center"
          >
            <Navigation className="w-3 h-3" />
            <span>Center KITSW</span>
          </button>
        </div>
      </div>

      {/* Selectable / Searchable Block Dropdown */}
      <div className="relative">
        <div
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-xl px-3.5 py-2.5 text-sm cursor-pointer hover:border-[#174B3A]/40 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-[#174B3A] shrink-0" />
            <span className="font-semibold text-[#242923] truncate">
              {location || 'Select KITSW Campus Location'}
            </span>
          </div>
          <span className="text-xs text-[#72766F] shrink-0">
            {isDropdownOpen ? '▲ Close' : '▼ Change'}
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl shadow-lg p-2 max-h-64 overflow-y-auto space-y-1">
            {/* Search filter input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-[#72766F] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blocks, library, cafeteria..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F2] border border-[#E5E2D9] rounded-lg text-[#242923] focus:outline-none focus:border-[#174B3A]"
                autoFocus
              />
            </div>

            {filteredBlocks.map((block) => {
              const isSelected = location === block.name;
              return (
                <div
                  key={block.id}
                  onClick={() => handleSelectBlock(block)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                    isSelected ? 'bg-[#EBF2ED] text-[#174B3A] font-semibold' : 'hover:bg-[#FAF8F2] text-[#242923]'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="font-medium">{block.name}</p>
                    <p className="text-[11px] text-[#72766F]">{block.description}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#174B3A] shrink-0" />}
                </div>
              );
            })}

            {filteredBlocks.length === 0 && (
              <p className="text-xs text-[#72766F] p-3 text-center">No campus buildings matching search.</p>
            )}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E5E2D9] bg-[#E8ECE9] shadow-inner">
        {/* Leaflet Map Target */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Loading Overlay */}
        {isLoadingTiles && (
          <div className="absolute inset-0 z-20 bg-[#F7F5EF]/80 backdrop-blur-2xs flex items-center justify-center gap-2 text-xs font-semibold text-[#174B3A]">
            <Loader2 className="w-4 h-4 animate-spin text-[#174B3A]" />
            <span>Loading KITSW Campus Map...</span>
          </div>
        )}

        {/* Map Error / Fallback Banner */}
        {mapError && (
          <div className="absolute top-2 left-2 right-2 z-20 bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{mapError}</span>
            </div>
          </div>
        )}

        {/* Floating Instruction Badge */}
        <div className="absolute bottom-2 left-2 z-20 bg-[#FFFEFA]/95 backdrop-blur-xs border border-[#E5E2D9] rounded-lg px-2.5 py-1 text-[11px] text-[#242923] shadow-xs flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#174B3A]" />
          <span>Click anywhere or drag pin to fine-tune location</span>
        </div>
      </div>

      {/* Selected location summary pill */}
      {activeBlock && (
        <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-[#174B3A]">{activeBlock.name}</span>
            <p className="text-[11px] text-[#72766F]">{activeBlock.description}</p>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#72766F] bg-[#EBF2ED] px-2 py-0.5 rounded">
            KITSW
          </span>
        </div>
      )}

      {error && <p className="text-xs text-[#C62828]">{error}</p>}
    </div>
  );
};
