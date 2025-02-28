
import { Label } from "@/components/ui/label";
import { LocationAutocomplete } from "@/components/map/LocationAutocomplete";
import { LocationMap } from "@/components/map/LocationMap";

interface LocationFieldProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function LocationField({ location, latitude, longitude, onLocationSelect }: LocationFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-white">Localisation</Label>
      <LocationAutocomplete
        onLocationSelect={onLocationSelect}
        placeholder="Entrez l'adresse..."
        defaultValue={location}
      />
      {latitude && longitude && (
        <div className="mt-2 h-[200px]">
          <LocationMap
            latitude={latitude}
            longitude={longitude}
            height="200px"
          />
        </div>
      )}
    </div>
  );
}
