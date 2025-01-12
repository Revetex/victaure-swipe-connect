import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SkillSelector } from "./SkillSelector";
import { useState } from "react";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({
  onSkillSelect,
  existingSkills,
}: TouchFriendlySkillSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Plus className="h-4 w-4" />
        Ajouter une compétence
      </Button>

      {isOpen && (
        <SkillSelector
          onSkillSelect={(skill) => {
            onSkillSelect(skill);
            setIsOpen(false);
          }}
          existingSkills={existingSkills}
        />
      )}
    </div>
  );
}