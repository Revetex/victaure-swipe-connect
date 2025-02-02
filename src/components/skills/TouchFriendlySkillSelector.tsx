import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { CategoryIcon } from "./CategoryIcon";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({ onSkillSelect, existingSkills }: TouchFriendlySkillSelectorProps) {
  const [customSkill, setCustomSkill] = useState("");

  const handleCustomSkillSubmit = () => {
    if (customSkill.trim() && !existingSkills.includes(customSkill.trim())) {
      onSkillSelect(customSkill.trim());
      setCustomSkill("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200 gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une compétence
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner une compétence</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Ajouter une compétence personnalisée"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCustomSkillSubmit();
              }
            }}
          />
          <Button 
            onClick={handleCustomSkillSubmit}
            disabled={!customSkill.trim() || existingSkills.includes(customSkill.trim())}
          >
            Ajouter
          </Button>
        </div>

        <ScrollArea className="h-[50vh]">
          <div className="space-y-6 pr-4">
            {Object.entries(skillCategories).map(([category, skills]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CategoryIcon category={category} />
                  <span>{category}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill) => (
                    <Button
                      key={skill}
                      variant="outline"
                      className={`text-sm justify-start ${
                        existingSkills.includes(skill) ? 'opacity-50' : ''
                      }`}
                      onClick={() => onSkillSelect(skill)}
                      disabled={existingSkills.includes(skill)}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}