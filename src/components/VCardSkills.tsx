import { Input } from "@/components/ui/input";
import { skillCategories } from "@/data/skills";
import { VCardSection } from "./VCardSection";
import { Brain } from "lucide-react";
import { useState } from "react";
import { SkillCategory } from "./skills/SkillCategory";
import { SkillEditor } from "./skills/SkillEditor";

interface VCardSkillsProps {
  profile: {
    skills: string[];
  };
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
}: VCardSkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(Object.keys(skillCategories)[0]);

  const filteredSkills = Object.values(skillCategories)
    .flatMap(categoryGroup => Object.values(categoryGroup))
    .flat()
    .filter(skill => !profile.skills.includes(skill) &&
      (skillCategories[selectedCategory]?.includes(skill) || !selectedCategory));

  const groupedSkills: Record<string, string[]> = profile.skills.reduce((acc: Record<string, string[]>, skill: string) => {
    const category = Object.entries(skillCategories).find(([_, skills]) =>
      Object.values(skills).flat().includes(skill)
    )?.[0] || "Autre";
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <VCardSection 
      title="Compétences" 
      icon={<Brain className="h-4 w-4 text-muted-foreground" />}
      className="space-y-3 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900/40 p-6 rounded-lg shadow-sm"
    >
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <SkillCategory
            key={category}
            category={category}
            skills={skills}
            isEditing={isEditing}
            searchTerm=""
            onRemoveSkill={handleRemoveSkill}
          />
        ))}
      </div>

      {isEditing && (
        <SkillEditor
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={handleAddSkill}
          skillCategories={skillCategories}
          filteredSkills={filteredSkills}
          existingSkills={profile.skills}
        />
      )}
    </VCardSection>
  );
}