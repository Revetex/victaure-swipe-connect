import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface CategorizedSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
}

export function CategorizedSkills({
  profile,
  isEditing,
  newSkill,
  setNewSkill,
  onAddSkill,
  onRemoveSkill
}: CategorizedSkillsProps) {
  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1"
          />
          <Button onClick={onAddSkill} disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {(profile.skills || []).map((skill, index) => (
          <Badge
            key={index}
            variant={isEditing ? "secondary" : "default"}
            className="flex items-center gap-1"
          >
            {skill}
            {isEditing && (
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveSkill(skill)}
              />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}