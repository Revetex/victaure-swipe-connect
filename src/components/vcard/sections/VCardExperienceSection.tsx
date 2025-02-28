
import { UserProfile, Experience } from "@/types/profile";
import { VCardExperiences } from "../VCardExperiences";

interface VCardExperienceSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperienceSection({
  profile,
  isEditing,
  setProfile,
}: VCardExperienceSectionProps) {
  const handleUpdateExperiences = (experiences: Experience[]) => {
    setProfile({ ...profile, experiences });
  };

  return (
    <div className="w-full">
      <VCardExperiences
        experiences={profile.experiences}
        isEditing={isEditing}
        onUpdate={handleUpdateExperiences}
      />
    </div>
  );
}
