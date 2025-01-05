import { useState } from "react";
import { LocationMap } from "./LocationMap";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface VCardContactProps {
  profile: any;
  isEditing?: boolean;
  onUpdate?: (field: string, value: any) => void;
}

export function VCardContact({ profile, isEditing, onUpdate }: VCardContactProps) {
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    onUpdate?.('latitude', lat);
    onUpdate?.('longitude', lng);
    toast.success("Position mise à jour");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Adresse</Label>
          <Input
            placeholder="Entrez votre adresse"
            value={profile.address || ""}
            onChange={(e) => onUpdate?.('address', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Input
            placeholder="Entrez votre ville"
            value={profile.city || ""}
            onChange={(e) => onUpdate?.('city', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Province</Label>
          <Input
            placeholder="Entrez votre province"
            value={profile.state || ""}
            onChange={(e) => onUpdate?.('state', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Pays</Label>
          <Input
            value="Canada"
            disabled
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Emplacement sur la carte</Label>
        <LocationMap
          latitude={profile.latitude}
          longitude={profile.longitude}
          isEditing={isEditing}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </div>
  );
}