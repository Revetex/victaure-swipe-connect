import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { CategoryIcon } from "./CategoryIcon";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({ onSkillSelect, existingSkills }: TouchFriendlySkillSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une compétence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner une compétence</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[50vh] mt-4">
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