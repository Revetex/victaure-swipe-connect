import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface VCardBioProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBio({ profile, isEditing, setProfile }: VCardBioProps) {
  return (
    <VCardSection title="Bio" icon={<FileText className="h-5 w-5" />}>
      {isEditing ? (
        <Textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Décrivez votre parcours..."
          className="min-h-[100px]"
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          {profile.bio || "Aucune bio disponible"}
        </p>
      )}
    </VCardSection>
  );
}