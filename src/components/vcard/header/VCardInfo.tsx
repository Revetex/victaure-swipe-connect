import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";

interface VCardInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  handleInputChange: (key: string, value: string) => void;
}

export function VCardInfo({ profile, isEditing, handleInputChange }: VCardInfoProps) {
  return (
    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
      {isEditing ? (
        <div className="space-y-3 w-full">
          <Input
            value={profile.full_name || ""}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            placeholder="Votre nom"
            className="text-lg sm:text-xl font-medium bg-card/5 border-border/10 placeholder:text-muted-foreground/50 w-full"
          />
          <Input
            value={profile.role || ""}
            onChange={(e) => handleInputChange("role", e.target.value)}
            placeholder="Votre rôle"
            className="text-sm sm:text-base bg-card/5 border-border/10 placeholder:text-muted-foreground/50 w-full"
          />
        </div>
      ) : (
        <div className="space-y-1">
          {profile.full_name && (
            <h2 className="text-xl sm:text-2xl font-bold truncate text-primary">
              {profile.full_name}
            </h2>
          )}
          {profile.role && (
            <p className="text-sm sm:text-base text-primary/70">
              {profile.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}