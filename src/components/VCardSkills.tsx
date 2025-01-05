import { VCardSection } from "./VCardSection";
import { Code } from "lucide-react";
import { CategorizedSkills } from "./skills/CategorizedSkills";
import { UserProfile } from "@/types/profile";
import { Dispatch, SetStateAction } from "react";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
}: VCardSkillsProps) {
  return (
    <VCardSection
      title="Compétences"
      icon={<Code className="h-5 w-5 text-muted-foreground" />}
    >
      <CategorizedSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
      />
    </VCardSection>
  );
}