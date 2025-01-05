import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profile";
import { StyleOption } from "./types";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface VCardContentProps {
  profile: Profile;
  isEditing: boolean;
  selectedStyle: StyleOption;
  setProfile: (profile: Profile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardContent({
  profile,
  isEditing,
  selectedStyle,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
}: VCardContentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Bio</h3>
        {isEditing ? (
          <Input
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Votre bio"
          />
        ) : (
          <p className="text-sm">{profile.bio || "Aucune bio"}</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Compétences</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills?.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
          {isEditing && (
            <div className="flex items-center gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Nouvelle compétence"
                className="max-w-[200px]"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddSkill();
                  }
                }}
              />
              <button
                onClick={handleAddSkill}
                className="p-2 rounded-full hover:bg-accent"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}