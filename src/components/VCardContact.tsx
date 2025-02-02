import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { provinces } from "@/hooks/data/provinces";
import { cities } from "@/hooks/data/cities";
import { UserProfile } from "@/types/profile";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({
  profile,
  isEditing,
  setProfile,
}: VCardContactProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>(profile.state || "");
  const [selectedCity, setSelectedCity] = useState<string>(profile.city || "");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [customCity, setCustomCity] = useState<string>("");

  useEffect(() => {
    if (selectedProvince) {
      const provinceCities = cities[selectedProvince] || [];
      setAvailableCities(provinceCities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedProvince]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setProfile({ ...profile, state: value });
    // Reset city when province changes
    setSelectedCity("");
    setProfile({ ...profile, state: value, city: "" });
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setCustomCity(value);
    setProfile({ ...profile, city: value });
  };

  const handlePhoneChange = (value: string) => {
    setProfile({ ...profile, phone: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="Votre numéro de téléphone"
              value={profile.phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="pl-8"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Combobox
            items={provinces.map(p => ({ label: p.name, value: p.name }))}
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Sélectionnez une province"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <div className="relative">
            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            {isEditing ? (
              <Combobox
                items={[
                  ...availableCities.map(city => ({ label: city, value: city })),
                  ...(customCity && !availableCities.includes(customCity) 
                    ? [{ label: customCity, value: customCity }] 
                    : [])
                ]}
                value={selectedCity}
                onChange={handleCityChange}
                placeholder="Entrez ou sélectionnez une ville"
                allowCustomValue
                disabled={!selectedProvince}
              />
            ) : (
              <Input
                value={profile.city || ""}
                className="pl-8"
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}