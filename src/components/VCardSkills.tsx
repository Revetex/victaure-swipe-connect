import { VCardSection } from "./VCardSection";
import { Code } from "lucide-react";
import { CategorizedSkills } from "./skills/CategorizedSkills";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { TouchFriendlySkillSelector } from "./skills/TouchFriendlySkillSelector";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
}: VCardSkillsProps) {
  // Remove duplicates from skills array before passing it to CategorizedSkills
  const uniqueSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];
  
  // Update profile if we found and removed duplicates
  if (profile.skills && profile.skills.length !== uniqueSkills.length) {
    setProfile({
      ...profile,
      skills: uniqueSkills
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <VCardSection
        title="Compétences"
        icon={<Code className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="space-y-6">
          <CategorizedSkills
            profile={{ ...profile, skills: uniqueSkills }}
            isEditing={isEditing}
            onRemoveSkill={handleRemoveSkill}
          />
          
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TouchFriendlySkillSelector
                onSkillSelect={(skill) => {
                  if (!profile.skills?.includes(skill)) {
                    setProfile({
                      ...profile,
                      skills: [...(profile.skills || []), skill]
                    });
                  }
                }}
                existingSkills={uniqueSkills}
              />
            </motion.div>
          )}
        </div>
      </VCardSection>
    </motion.div>
  );
}