import { useState } from "react";
import { skillCategories } from "@/data/skills";
import { CategoryIcon } from "./CategoryIcon";
import { useVCardStyle } from "../vcard/VCardStyleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TouchFriendlySkillSelectorProps {
  onSkillSelect: (skill: string) => void;
  existingSkills: string[];
}

export function TouchFriendlySkillSelector({
  onSkillSelect,
  existingSkills,
}: TouchFriendlySkillSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(skillCategories)[0]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const { selectedStyle } = useVCardStyle();

  const handleAddSkill = () => {
    if (selectedSkill && !existingSkills.includes(selectedSkill)) {
      onSkillSelect(selectedSkill);
      setSelectedSkill("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger 
            className="w-full sm:w-[200px] bg-card"
            style={{
              color: selectedStyle.colors.text.primary,
              fontFamily: selectedStyle.font
            }}
          >
            <div className="flex items-center gap-2">
              <CategoryIcon category={selectedCategory} />
              <SelectValue placeholder="Catégorie" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(skillCategories).map((category) => (
              <SelectItem 
                key={category} 
                value={category}
                style={{
                  color: selectedStyle.colors.text.primary,
                  fontFamily: selectedStyle.font
                }}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon category={category} />
                  <span>{category}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Select
            value={selectedSkill}
            onValueChange={setSelectedSkill}
          >
            <SelectTrigger 
              className="w-full bg-card"
              style={{
                color: selectedStyle.colors.text.primary,
                fontFamily: selectedStyle.font
              }}
            >
              <SelectValue placeholder="Sélectionnez une compétence" />
            </SelectTrigger>
            <SelectContent>
              {(skillCategories[selectedCategory] || [])
                .filter(skill => !existingSkills.includes(skill))
                .map((skill) => (
                  <SelectItem 
                    key={skill} 
                    value={skill}
                    style={{
                      color: selectedStyle.colors.text.primary,
                      fontFamily: selectedStyle.font
                    }}
                  >
                    {skill}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAddSkill}
          variant="secondary"
          className="w-full sm:w-auto"
          style={{
            backgroundColor: selectedStyle.colors.primary,
            color: '#fff'
          }}
          disabled={!selectedSkill}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
}