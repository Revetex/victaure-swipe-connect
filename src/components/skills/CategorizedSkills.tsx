import { motion, AnimatePresence } from "framer-motion";
import { SkillCategory } from "./SkillCategory";
import { UserProfile } from "@/types/profile";
import { skillCategories } from "@/data/skills";

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

  // Group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  
  groupedSkills.forEach(skill => {
    let foundCategory = "Autre";
    
    // Find which category the skill belongs to
    Object.entries(skillCategories).forEach(([category, skills]) => {
      if (skills.includes(skill)) {
        foundCategory = category;
      }
    });
    
    if (!skillsByCategory[foundCategory]) {
      skillsByCategory[foundCategory] = [];
    }
    skillsByCategory[foundCategory].push(skill);
  });

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SkillCategory
              category={category}
              skills={skills}
              isEditing={isEditing}
              searchTerm=""
              onRemoveSkill={onRemoveSkill}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}