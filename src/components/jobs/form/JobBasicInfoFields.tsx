import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationMap } from "@/components/map/LocationMap";
import { useState } from "react";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  onChange: (field: string, value: string | number) => void;
}

export function JobBasicInfoFields({
  title,
  description,
  budget,
  location,
  onChange,
}: JobBasicInfoFieldsProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    onChange("latitude", lat);
    onChange("longitude", lng);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de la mission</Label>
        <Input
          id="title"
          placeholder="Ex: Développeur React Senior"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          placeholder="Décrivez les responsabilités et les attentes..."
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget (CAD)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="Ex: 5000"
          value={budget}
          onChange={(e) => onChange("budget", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          placeholder="Ex: Montréal, QC"
          value={location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
        <LocationMap
          latitude={coordinates?.lat}
          longitude={coordinates?.lng}
          onLocationSelect={handleLocationSelect}
          isEditing={true}
        />
      </div>
    </div>
  );
}