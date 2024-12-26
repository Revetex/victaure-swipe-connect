import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Select } from "@/components/ui/select";
import { predefinedSkills } from "@/data/skills";

interface VCardSkillsProps {
  profile: any;
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
  return (
    <div>
      <h3 className="font-semibold mb-2">Compétences</h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            {isEditing && (
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveSkill(skill)}
              />
            )}
          </Badge>
        ))}
      </div>
      {isEditing && (
        <div className="flex gap-2 mt-2">
          <Select
            value={newSkill}
            onValueChange={setNewSkill}
            placeholder="Sélectionnez une compétence"
          >
            {predefinedSkills
              .filter((skill) => !profile.skills.includes(skill))
              .map((skill) => (
                <Select.Option key={skill} value={skill}>
                  {skill}
                </Select.Option>
              ))}
          </Select>
          <Button onClick={handleAddSkill}>Ajouter</Button>
        </div>
      )}
    </div>
  );
}