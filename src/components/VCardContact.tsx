import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { quebecCities } from "@/hooks/data/cities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
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
              <Select
                value={profile.city || ""}
                onValueChange={(value) => handleInputChange("city", value)}
              >
                <SelectTrigger className="w-full bg-background/50 dark:bg-background/20 border-border/20 min-h-[44px]">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {quebecCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {profile.city && (
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground/80">
                  {profile.city}
                </span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}