import { ReactNode } from "react";
import { VCardBadge } from "../VCardBadge";

interface SkillCategoryProps {
  category: string;
  skills: string[];
  icon: ReactNode;
  isEditing: boolean;
  searchTerm: string;
  onRemoveSkill?: (skill: string) => void;
}

export function SkillCategory({
  category,
  skills,
  icon,
  isEditing,
  searchTerm,
  onRemoveSkill,
}: SkillCategoryProps) {
  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredSkills.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-400 font-medium">
        {icon}
        <span>{category}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredSkills.map((skill: string) => (
          <VCardBadge
            key={skill}
            text={skill}
            isEditing={isEditing}
            onRemove={() => onRemoveSkill?.(skill)}
          />
        ))}
      </div>
    </div>
  );
}