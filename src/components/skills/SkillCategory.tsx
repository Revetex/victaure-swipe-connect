import { motion } from "framer-motion";
import { CategoryIcon } from "./CategoryIcon";

interface SkillCategoryProps {
  category: string;
  skills: string[];
  isEditing: boolean;
  searchTerm: string;
  onRemoveSkill: (skill: string) => void;
}

export function SkillCategory({
  category,
  skills,
  isEditing,
  searchTerm,
  onRemoveSkill,
}: SkillCategoryProps) {
  // Remove duplicates and filter based on search term
  const uniqueSkills = Array.from(new Set(skills));
  const filteredSkills = uniqueSkills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSkills.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2">
        <CategoryIcon category={category} />
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredSkills.map((skill, index) => (
          <motion.span
            key={`${category}-${skill}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary relative group"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => onRemoveSkill(skill)}
                className="ml-1 text-primary/60 hover:text-primary focus:outline-none"
              >
                ×
              </button>
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}