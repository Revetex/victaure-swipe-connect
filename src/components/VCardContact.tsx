import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profile";
import { Phone, MapPin } from "lucide-react";

interface VCardContactProps {
  profile: Profile;
  isEditing: boolean;
  setProfile: (profile: Profile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-muted-foreground" />
        {isEditing ? (
          <Input
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Votre numéro de téléphone"
            className="max-w-[200px]"
          />
        ) : (
          <span>{profile.phone || "Non renseigné"}</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={profile.city || ""}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="Ville"
              className="max-w-[150px]"
            />
            <Input
              value={profile.state || ""}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              placeholder="Province"
              className="max-w-[150px]"
            />
          </div>
        ) : (
          <span>
            {profile.city && profile.state 
              ? `${profile.city}, ${profile.state}`
              : "Non renseigné"}
          </span>
        )}
      </div>
    </div>
  );
}