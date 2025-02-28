
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
  readonly?: boolean;
}

export function LocationMap({
  latitude = 45.5017,
  longitude = -73.5673,
  onLocationChange,
  height = '300px',
  className = '',
  readonly = false
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      const google = await loader.load();
      
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 13,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#F1F0FB" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { color: "#1B2A4A" }],
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#1A1F2C" }],
            },
          ],
        });

        const marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          draggable: !readonly,
        });

        if (!readonly) {
          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            if (position && onLocationChange) {
              onLocationChange(position.lat(), position.lng());
            }
          });

          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            const position = e.latLng;
            if (position) {
              marker.setPosition(position);
              if (onLocationChange) {
                onLocationChange(position.lat(), position.lng());
              }
            }
          });
        }

        setMap(map);
        setMarker(marker);
      }
    };

    initMap();
  }, [latitude, longitude, readonly]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div ref={mapRef} style={{ width: '100%', height }} />
    </Card>
  );
}
