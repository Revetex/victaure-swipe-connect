import { VCardSection } from "./VCardSection";
import { Code } from "lucide-react";
import { CategorizedSkills } from "./skills/CategorizedSkills";
import { UserProfile } from "@/types/profile";
import { TouchFriendlySkillSelector } from "./skills/TouchFriendlySkillSelector";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
  customStyles
}: VCardSkillsProps) {
  const uniqueSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];
  
  if (profile.skills && profile.skills.length !== uniqueSkills.length) {
    setProfile({
      ...profile,
      skills: uniqueSkills
    });
  }

  const handleAddSkill = (skill: string) => {
    if (!uniqueSkills.includes(skill)) {
      setProfile({
        ...profile,
        skills: [...uniqueSkills, skill]
      });
    }
  };

  return (
    <VCardSection
      title="Compétences"
      icon={<Code className="h-5 w-5 text-muted-foreground" />}
      customStyles={customStyles}
    >
      <div className="space-y-4">
        <CategorizedSkills
          profile={{ ...profile, skills: uniqueSkills }}
          isEditing={isEditing}
          onRemoveSkill={handleRemoveSkill}
        />
        
        {isEditing && (
          <TouchFriendlySkillSelector
            onSkillSelect={handleAddSkill}
            existingSkills={uniqueSkills}
          />
        )}
      </div>
    </VCardSection>
  );
}