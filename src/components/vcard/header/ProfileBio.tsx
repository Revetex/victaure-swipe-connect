import { UserProfile } from "@/types/profile";
import { Textarea } from "@/components/ui/textarea";

interface ProfileBioProps {
  profile: UserProfile;
  isEditing: boolean;
  handleInputChange: (key: string, value: string) => void;
}

export function ProfileBio({ profile, isEditing, handleInputChange }: ProfileBioProps) {
  if (!profile.bio && !isEditing) return null;

  return (
    <div className="mt-4">
      {isEditing ? (
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 min-h-[100px]"
          placeholder="Votre bio"
        />
      ) : (
        <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
      )}
    </div>
  );
}