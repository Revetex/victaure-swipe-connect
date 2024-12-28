import { Input } from "@/components/ui/input";
import { predefinedSkills } from "@/data/skills";
import { VCardSection } from "./VCardSection";
import { Brain, Filter } from "lucide-react";
import { useState } from "react";
import { SkillCategory } from "./skills/SkillCategory";
import { SkillEditor } from "./skills/SkillEditor";

const skillCategories: Record<string, string[]> = {
  "Développement": ["JavaScript", "TypeScript", "Python", "React", "Node.js"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "CI/CD", "Git"],
  "Design": ["UI Design", "UX Research", "Figma", "Adobe XD"],
  "Gestion": ["Agile", "Scrum", "Leadership", "Communication"],
  "Construction": ["Maçonnerie", "Charpente", "Plomberie", "Électricité"],
  "Manuel": ["Peinture", "Carrelage", "Menuiserie", "Serrurerie"]
};

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
  const [selectedCategory, setSelectedCategory] = useState<string>("Développement");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = predefinedSkills.filter(
    skill => !profile.skills.includes(skill) &&
    (skillCategories[selectedCategory]?.includes(skill) || !selectedCategory) &&
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSkills: Record<string, string[]> = profile.skills.reduce((acc: Record<string, string[]>, skill: string) => {
    const category = Object.entries(skillCategories).find(([_, skills]) => 
      skills.includes(skill)
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
      {!isEditing && (
        <div className="mb-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <SkillCategory
            key={category}
            category={category}
            skills={skills}
            isEditing={isEditing}
            searchTerm={searchTerm}
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
        />
      )}
    </VCardSection>
  );
}