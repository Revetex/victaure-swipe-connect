import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { toast } from "sonner";

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  isEditing?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function LocationMap({ latitude, longitude, isEditing, onLocationSelect }: LocationMapProps) {
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click coordinates to approximate lat/lng
    // Canada's approximate bounds: lat: 41.7-83.1°N, lng: -141.0--52.6°W
    const lng = -141.0 + (x / rect.width) * (141.0 - 52.6);
    const lat = 41.7 + ((rect.height - y) / rect.height) * (83.1 - 41.7);

    onLocationSelect?.(lat, lng);
    toast.success("Position sélectionnée");
  };

  return (
    <Card className="w-full h-[300px] relative overflow-hidden">
      <div 
        className="w-full h-full relative cursor-pointer bg-[url('/canada-map.png')] bg-cover bg-center"
        onClick={handleMapClick}
      >
        {latitude && longitude && (
          <div 
            className="absolute"
            style={{
              left: `${((longitude + 141.0) / (141.0 - 52.6)) * 100}%`,
              bottom: `${((latitude - 41.7) / (83.1 - 41.7)) * 100}%`,
              transform: 'translate(-50%, 50%)'
            }}
          >
            <MapPin className="h-6 w-6 text-primary animate-bounce" />
          </div>
        )}
      </div>
      {isEditing && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-center">
          <Button variant="secondary" className="bg-background/80 backdrop-blur-sm">
            Cliquez sur la carte pour sélectionner un emplacement
          </Button>
        </div>
      )}
    </Card>
  );
}