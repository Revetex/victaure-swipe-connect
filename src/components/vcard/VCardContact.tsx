import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { AtSign, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  return (
    <VCardSection title="Contact" icon={<AtSign className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {isEditing ? (
            <Input
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Numéro de téléphone"
            />
          ) : (
            <span>{profile.phone || "Non renseigné"}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {isEditing ? (
            <div className="space-y-2 w-full">
              <Input
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Ville"
              />
              <Input
                value={profile.country || ""}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="Pays"
              />
            </div>
          ) : (
            <span>
              {[profile.city, profile.country].filter(Boolean).join(", ") || "Non renseigné"}
            </span>
          )}
        </div>
      </div>
    </VCardSection>
  );
}