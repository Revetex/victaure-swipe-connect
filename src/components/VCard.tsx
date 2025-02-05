import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { VCardHeader } from "./vcard/sections/header/VCardHeader";
import { VCardContact } from "./vcard/sections/VCardContact";
import { VCardSkills } from "./VCardSkills";
import { VCardCertifications } from "./vcard/sections/VCardCertifications";
import { VCardEducation } from "./VCardEducation";
import { VCardExperience } from "./vcard/sections/VCardExperience";
import { toast } from "sonner";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ profile, isPublicView = false, onEditStateChange, onRequestChat }: VCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Aucune donnée de profil disponible</p>
      </div>
    );
  }

  const handleEditToggle = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    if (onEditStateChange) {
      onEditStateChange(newEditingState);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setTempProfile(updatedProfile);
    toast.success("Profil mis à jour avec succès");
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = tempProfile.skills?.filter(s => s !== skill) || [];
    handleProfileUpdate({ ...tempProfile, skills: updatedSkills });
  };

  return (
    <div className={cn(
      "vcard space-y-8 p-6 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      isPublicView ? 'public' : 'private'
    )}>
      <VCardHeader 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
        onEditToggle={handleEditToggle}
      />
      <VCardContact 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
      />
      <VCardSkills 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
        handleRemoveSkill={handleRemoveSkill}
      />
      <VCardCertifications 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
      />
      <VCardEducation 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
      />
      <VCardExperience 
        profile={tempProfile}
        isEditing={isEditing}
        setProfile={handleProfileUpdate}
      />
    </div>
  );
}