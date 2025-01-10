import { VCardSkills } from "./VCardSkills";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";
import { TouchFriendlySkillSelector } from "../skills/TouchFriendlySkillSelector";

interface VCardContentProps {
  profile: UserProfile;
  isEditing: boolean;
  selectedStyle: StyleOption;
  setProfile: (profile: UserProfile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
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
    <div className="space-y-6">
      <VCardSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={handleRemoveSkill}
      />
      
      {isEditing && (
        <TouchFriendlySkillSelector
          onSkillSelect={(skill) => {
            if (!profile || profile.skills?.includes(skill)) return;
            const updatedSkills = [...(profile.skills || []), skill];
            setProfile({ ...profile, skills: updatedSkills });
          }}
          existingSkills={profile.skills || []}
        />
      )}
    </div>
  );
}