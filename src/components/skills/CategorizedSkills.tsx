import { motion } from "framer-motion";
import { SkillCategory } from "./SkillCategory";
import { UserProfile } from "@/types/profile";

interface CategorizedSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  onRemoveSkill: (skill: string) => void;
}

export function CategorizedSkills({
  profile,
  isEditing,
  onRemoveSkill,
}: CategorizedSkillsProps) {
  const groupedSkills = profile.skills ? Array.from(new Set(profile.skills)) : [];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SkillCategory
          category="Compétences"
          skills={groupedSkills}
          isEditing={isEditing}
          searchTerm=""
          onRemoveSkill={onRemoveSkill}
        />
      </motion.div>
    </div>
  );
}