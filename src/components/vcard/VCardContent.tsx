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
    <div className="w-full px-0">
      <VCardSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={handleRemoveSkill}
      />
    </div>
  );
}