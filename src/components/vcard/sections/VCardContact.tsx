import { UserProfile } from "@/types/profile";

interface VCardContactProps {
  profile: UserProfile;
}

export function VCardContact({ profile }: VCardContactProps) {
  return (
    <div className="space-y-4">
      {profile.email && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Email:</span>
          {profile.email}
        </div>
      )}
      
      {profile.phone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Téléphone:</span>
          {profile.phone}
        </div>
      )}
      
      {(profile.city || profile.state || profile.country) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Localisation:</span>
          {[profile.city, profile.state, profile.country]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}
    </div>
  );
}