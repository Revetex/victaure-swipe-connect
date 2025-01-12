import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact</h3>
      <div className="space-y-2">
        {profile.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${profile.email}`} className="text-sm hover:underline">
              {profile.email}
            </a>
          </div>
        )}
        {profile.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${profile.phone}`} className="text-sm hover:underline">
              {profile.phone}
            </a>
          </div>
        )}
        {(profile.city || profile.state) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}