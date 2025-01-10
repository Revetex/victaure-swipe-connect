import { UserProfile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({ profile, isEditing, handleRemoveSkill }: VCardSkillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {profile.skills?.map((skill) => (
        <Badge
          key={skill}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {skill}
          {isEditing && (
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}