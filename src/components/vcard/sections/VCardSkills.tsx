import { UserProfile } from "@/types/profile";
import { VCardBadge } from "@/components/VCardBadge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface VCardSkillsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardSkills({ 
  profile, 
  isEditing, 
  setProfile,
  handleRemoveSkill 
}: VCardSkillsProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(profile.skills || []), newSkill.trim()];
      setProfile({ ...profile, skills: updatedSkills });
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Compétences</h3>
      
      <div className="flex flex-wrap gap-2">
        {profile.skills?.map((skill, index) => (
          <VCardBadge
            key={index}
            text={skill}
            isEditing={isEditing}
            onRemove={() => handleRemoveSkill(skill)}
          />
        ))}
      </div>

      {isEditing && (
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Nouvelle compétence"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}