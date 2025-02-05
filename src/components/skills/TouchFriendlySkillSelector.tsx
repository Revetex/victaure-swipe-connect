import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { skillCategories } from "@/data/skills";
import { CategoryIcon } from "./CategoryIcon";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({ onSkillSelect, existingSkills }: TouchFriendlySkillSelectorProps) {
  const [customSkill, setCustomSkill] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCustomSkillSubmit = () => {
    if (customSkill.trim() && !existingSkills.includes(customSkill.trim())) {
      onSkillSelect(customSkill.trim());
      setCustomSkill("");
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200 gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-3 w-3" />
        Ajouter une compétence
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
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
                        className="text-xs justify-start"
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
    </>
  );
}