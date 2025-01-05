import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  isEditing?: boolean;
}

export function LocationMap({ latitude, longitude, onLocationSelect, isEditing }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoidGJsYW5jaGV0IiwiYSI6ImNscmxvZGVlZjBjcmUya3BnZGxqbXJyMWsifQ.YkOYoJrZJBGXBEVGhGE-Ug';
    
    const initialCenter: [number, number] = [longitude || -72.5, latitude || 46.35];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker if coordinates exist
    if (latitude && longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Add click handler if editing
    if (isEditing) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        } else {
          marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
        }
        onLocationSelect?.(lat, lng);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, isEditing, onLocationSelect]);

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}