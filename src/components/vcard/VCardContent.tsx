import { useState } from "react";
import { VCardHeader } from "@/components/VCardHeader";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardExperiences } from "@/components/VCardExperiences";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { CardContent } from "@/components/ui/card";
import { VCardStyleSelector } from "./VCardStyleSelector";
import { StyleOption } from "./types";
import { UserProfile } from "@/types/profile";
import { VCardActions } from "@/components/VCardActions";

interface VCardContentProps {
  profile: UserProfile;
  selectedStyle: StyleOption;
  setSelectedStyle: (style: StyleOption) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
  setProfile: (profile: UserProfile) => void;
  styleOptions: StyleOption[];
}

export function VCardContent({
  profile,
  selectedStyle,
  setSelectedStyle,
  onEditStateChange,
  onRequestChat,
  setProfile,
  styleOptions,
}: VCardContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleEditStateChange = (state: boolean) => {
    setIsEditing(state);
    onEditStateChange?.(state);
  };

  const handleAddSkill = () => {
    if (newSkill && profile.skills) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (profile.skills) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill !== skillToRemove),
      });
    }
  };

  return (
    <CardContent className="p-0">
      <div className="relative">
        <VCardStyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
          styleOptions={styleOptions}
        />

        <VCardHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardContact
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <div className="mt-6">
          <VCardSkills
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
        </div>

        <div className="mt-6">
          <VCardExperiences
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </div>

        <div className="mt-6">
          <VCardCertifications
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </div>

        <div className="mt-6">
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        </div>
      </div>
    </CardContent>
  );
}
