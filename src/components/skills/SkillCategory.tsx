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
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CategoryIcon category={category} />
        <h3 className="font-medium">{category}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills
          .filter((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((skill) => (
            <motion.span
              key={`${category}-${skill}`}
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