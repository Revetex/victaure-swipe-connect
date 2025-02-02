import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { provinceData } from "@/hooks/data/provinces";
import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const [selectedProvince, setSelectedProvince] = useState(profile.state || "");
  const provinces = Object.keys(provinceData);
  const cities = selectedProvince ? provinceData[selectedProvince as keyof typeof provinceData] || [] : [];

  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    handleInputChange("state", province);
    // Reset city when province changes
    handleInputChange("city", "");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 sm:p-6 rounded-xl bg-card/50 dark:bg-card/20 backdrop-blur-sm border border-border/10"
    >
      <h3 className="text-base sm:text-lg font-semibold text-foreground/90">Contact</h3>
      <div className="space-y-2">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={profile.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className="flex-1 bg-background/50 dark:bg-background/20 border-border/20 min-h-[44px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                value={profile.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Téléphone"
                type="tel"
                className="flex-1 bg-background/50 dark:bg-background/20 border-border/20 min-h-[44px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 space-y-2">
                <Select
                  value={selectedProvince}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger className="w-full bg-background/50 dark:bg-background/20 border-border/20 min-h-[44px]">
                    <SelectValue placeholder="Sélectionnez une province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Combobox
                  items={cities}
                  value={profile.city || ""}
                  onChange={(value) => handleInputChange("city", value)}
                  placeholder="Entrez ou sélectionnez une ville"
                  className="w-full bg-background/50 dark:bg-background/20 border-border/20 min-h-[44px]"
                  allowCustomValue
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {profile.email && (
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${profile.email}`} 
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  {profile.email}
                </a>
              </motion.div>
            )}
            {profile.phone && (
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${profile.phone}`} 
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  {profile.phone}
                </a>
              </motion.div>
            )}
            {(profile.city || profile.state) && (
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground/80">
                  {[profile.city, profile.state].filter(Boolean).join(", ")}
                </span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}