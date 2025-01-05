import { useState } from "react";
import { VCardMainContent } from "./sections/VCardMainContent";
import { VCardContent } from "./VCardContent";
import { useProfile } from "@/hooks/useProfile";
import { StyleOption } from "./types";

interface VCardProps {
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function VCard({ onEditStateChange, onRequestChat }: VCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>("modern");
  const { profile, setProfile } = useProfile();

  const handleEditStateChange = (newState: boolean) => {
    setIsEditing(newState);
    onEditStateChange(newState);
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="relative">
      <VCardMainContent
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <VCardContent
        profile={profile}
        isEditing={isEditing}
        selectedStyle={selectedStyle}
        setProfile={setProfile}
        newSkill=""
        setNewSkill={() => {}}
        handleAddSkill={() => {}}
        handleRemoveSkill={() => {}}
      />
    </div>
  );
}