
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GoogleMapProps {
  apiKey: string;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title?: string;
  }>;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  className?: string;
}

export function GoogleMap({ 
  apiKey, 
  markers = [], 
  center = { lat: 45.5017, lng: -73.5673 }, // Montréal par défaut
  zoom = 12,
  onMapClick,
  className = "w-full h-[400px]"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        });

        const google = await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          if (onMapClick) {
            mapInstance.addListener("click", onMapClick);
          }

          setMap(mapInstance);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, [apiKey]);

  // Mettre à jour les markers quand ils changent
  useEffect(() => {
    if (map) {
      // Nettoyer les anciens markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Ajouter les nouveaux markers
      markers.forEach(({ position, title }) => {
        const marker = new google.maps.Marker({
          position,
          map,
          title,
          animation: google.maps.Animation.DROP
        });
        markersRef.current.push(marker);
      });
    }
  }, [markers, map]);

  if (loading) {
    return (
      <Card className={`${className} flex items-center justify-center`}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  return <Card className={className} ref={mapRef} />;
}
