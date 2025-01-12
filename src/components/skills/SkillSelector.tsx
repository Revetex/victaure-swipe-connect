import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { skillCategories } from "@/data/skills";

interface SkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function SkillSelector({ onSkillSelect, existingSkills }: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Flatten all skills from categories into a single array
  const allSkills = Object.values(skillCategories).flat();
  
  // Filter skills based on search and exclude existing ones
  const filteredSkills = allSkills
    .filter(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !existingSkills.includes(skill)
    );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Rechercher une compétence..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {filteredSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => onSkillSelect(skill)}
              className="w-full text-left px-2 py-1 rounded hover:bg-accent transition-colors"
            >
              {skill}
            </button>
          ))}
          {filteredSkills.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Aucune compétence trouvée
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}