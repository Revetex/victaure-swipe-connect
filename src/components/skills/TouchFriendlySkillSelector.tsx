import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { skillCategories } from "@/data/skills";
import { SkillCategory } from "./SkillCategory";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
  availableSkills?: string[];
}

export function TouchFriendlySkillSelector({ 
  onSkillSelect, 
  existingSkills,
  availableSkills = Object.values(skillCategories).flat()
}: TouchFriendlySkillSelectorProps) {
  const [customSkill, setCustomSkill] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSkillSelect = (skill: string) => {
    onSkillSelect(skill);
    setIsOpen(false);
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      onSkillSelect(customSkill.trim());
      setCustomSkill("");
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Select Skills</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <h2>Select Skills</h2>
          <div>
            {availableSkills.map((skill) => (
              <Button 
                key={skill} 
                onClick={() => handleSkillSelect(skill)} 
                disabled={existingSkills.includes(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
          <Input 
            value={customSkill} 
            onChange={(e) => setCustomSkill(e.target.value)} 
            placeholder="Add custom skill" 
          />
          <Button onClick={handleAddCustomSkill}>Add Skill</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
