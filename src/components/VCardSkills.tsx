import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { predefinedSkills } from "@/data/skills";
import { VCardSection } from "./VCardSection";
import { VCardBadge } from "./VCardBadge";
import { Sparkles } from "lucide-react";

interface VCardSkillsProps {
  profile: any;
  isEditing: boolean;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({
  profile,
  isEditing,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
}: VCardSkillsProps) {
  return (
    <VCardSection 
      title="Compétences" 
      icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
      className="space-y-3"
    >
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill: string) => (
          <VCardBadge
            key={skill}
            text={skill}
            isEditing={isEditing}
            onRemove={() => handleRemoveSkill(skill)}
          />
        ))}
      </div>
      {isEditing && (
        <div className="flex gap-2 mt-2">
          <Select
            value={newSkill}
            onValueChange={setNewSkill}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sélectionnez une compétence" />
            </SelectTrigger>
            <SelectContent>
              {predefinedSkills
                .filter((skill) => !profile.skills.includes(skill))
                .map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddSkill} variant="secondary">
            Ajouter
          </Button>
        </div>
      )}
    </VCardSection>
  );
}