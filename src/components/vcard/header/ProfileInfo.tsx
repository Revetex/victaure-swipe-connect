import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";

interface ProfileInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  handleInputChange: (key: string, value: string) => void;
}

export function ProfileInfo({ profile, isEditing, handleInputChange }: ProfileInfoProps) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={profile.full_name || ""}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus:ring-0"
          placeholder="Votre nom"
        />
        <Input
          type="text"
          value={profile.role || ""}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="text-muted-foreground bg-transparent border-none focus:ring-0"
          placeholder="Votre rôle"
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary tracking-tight">
        {profile.full_name || 'Profil sans nom'}
      </h2>
      {profile.role && (
        <p className="text-muted-foreground mt-1">{profile.role}</p>
      )}
    </div>
  );
}