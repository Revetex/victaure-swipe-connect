import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [mapboxToken, setMapboxToken] = useState<string>('');

  // Fetch Mapbox token on component mount
  useEffect(() => {
    async function fetchMapboxToken() {
      try {
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secret_name: 'MAPBOX_PUBLIC_TOKEN' }
        });
        
        if (error) throw error;
        if (data?.secret) {
          setMapboxToken(data.secret);
        } else {
          toast.error("Impossible de charger la carte: token Mapbox manquant");
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast.error("Erreur lors du chargement de la carte");
      }
    }

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
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
  }, [latitude, longitude, isEditing, onLocationSelect, mapboxToken]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14
          });

          if (marker.current) {
            marker.current.setLngLat([longitude, latitude]);
          } else {
            marker.current = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        }

        onLocationSelect?.(latitude, longitude);
        toast.success("Position actuelle récupérée avec succès");
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error("Impossible d'obtenir votre position actuelle");
      }
    );
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <Button 
          onClick={getCurrentLocation}
          className="w-full"
          variant="outline"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Utiliser ma position actuelle
        </Button>
      )}
      <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div ref={mapContainer} className="h-full w-full" />
      </div>
    </div>
  );
}