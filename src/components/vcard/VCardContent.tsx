import { VCardSkills } from "../VCardSkills";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";

interface VCardContentProps {
  profile: UserProfile;
  isEditing: boolean;
  selectedStyle: StyleOption;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardContent({
  profile,
  isEditing,
  selectedStyle,
  setProfile,
  handleRemoveSkill,
}: VCardContentProps) {
  return (
    <div className="space-y-4 sm:space-y-6 w-full px-4 sm:px-6 lg:px-8">
      <VCardSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={handleRemoveSkill}
      />
    </div>
  );
}