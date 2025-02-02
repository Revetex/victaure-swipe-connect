import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { provinces } from "@/hooks/data/provinces";
import { getCitiesForProvince } from "@/hooks/data/cities";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (profile.state) {
      const cities = getCitiesForProvince(profile.state as keyof typeof provinceData);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [profile.state]);

  const handleProvinceChange = (value: string) => {
    setProfile(prev => ({ ...prev, state: value, city: "" }));
  };

  const handleCityChange = (value: string) => {
    setProfile(prev => ({ ...prev, city: value }));
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Téléphone</Label>
            <p className="text-sm text-muted-foreground">{profile.phone || "Non spécifié"}</p>
          </div>
          <div>
            <Label>Ville</Label>
            <p className="text-sm text-muted-foreground">{profile.city || "Non spécifié"}</p>
          </div>
          <div>
            <Label>Province</Label>
            <p className="text-sm text-muted-foreground">{profile.state || "Non spécifié"}</p>
          </div>
          <div>
            <Label>Pays</Label>
            <p className="text-sm text-muted-foreground">{profile.country || "Non spécifié"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={profile.phone || ""}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Votre numéro de téléphone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Combobox
            items={provinces.map(p => ({ label: p.name, value: p.name }))}
            value={profile.state || ""}
            onChange={handleProvinceChange}
            placeholder="Sélectionnez une province"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Combobox
            items={availableCities.map(city => ({ label: city, value: city }))}
            value={profile.city || ""}
            onChange={handleCityChange}
            placeholder="Sélectionnez une ville"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            value={profile.country || ""}
            onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
            placeholder="Votre pays"
          />
        </div>
      </div>
    </div>
  );
}