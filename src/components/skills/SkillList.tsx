import { SkillCategory } from "./SkillCategory";
import { SkillListProps } from "@/types/skills";

export function SkillList({ groupedSkills, isEditing, onRemoveSkill }: SkillListProps) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <SkillCategory
          key={category}
          category={category}
          skills={skills}
          isEditing={isEditing}
          searchTerm=""
          onRemoveSkill={onRemoveSkill}
        />
      ))}
    </div>
  );
}