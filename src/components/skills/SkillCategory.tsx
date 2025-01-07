import { motion } from "framer-motion";
import { CategoryIcon } from "./CategoryIcon";

interface SkillCategoryProps {
  category: string;
  skills: string[];
  isEditing?: boolean;
  onRemoveSkill?: (skill: string) => void;
}

export function SkillCategory({ category, skills, isEditing, onRemoveSkill }: SkillCategoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <CategoryIcon category={category} />
        <h3 className="text-lg font-semibold">{category}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <motion.div
            key={`${category}-${skill}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative group"
          >
            <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-sm">
              {skill}
              {isEditing && onRemoveSkill && (
                <button
                  onClick={() => onRemoveSkill(skill)}
                  className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}