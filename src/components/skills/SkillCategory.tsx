import { VCardBadge } from "../VCardBadge";
import { CategoryIcon } from "./CategoryIcon";
import { motion } from "framer-motion";

interface SkillCategoryProps {
  category: string;
  skills: string[];
  isEditing: boolean;
  searchTerm: string;
  onRemoveSkill?: (skill: string) => void;
}

export function SkillCategory({
  category,
  skills,
  isEditing,
  searchTerm,
  onRemoveSkill,
}: SkillCategoryProps) {
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSkills.length === 0) return null;

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 text-sm font-medium border-b pb-2 dark:border-gray-800">
        <CategoryIcon category={category} />
        <span className="text-foreground/80">{category}</span>
        <span className="text-xs text-muted-foreground">({filteredSkills.length})</span>
      </div>
      <div className="flex flex-wrap gap-2 pl-2">
        {filteredSkills.map((skill: string) => (
          <VCardBadge
            key={skill}
            text={skill}
            isEditing={isEditing}
            onRemove={() => onRemoveSkill?.(skill)}
            variant={category.toLowerCase() === "soft skills" ? "secondary" : "default"}
          />
        ))}
      </div>
    </motion.div>
  );
}