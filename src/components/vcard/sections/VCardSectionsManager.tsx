import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types/profile";
import { VCardSections } from "../VCardSections";
import { useVCardStyle } from "../VCardStyleContext";
import { toast } from "sonner";

interface VCardSectionsManagerProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardSectionsManager({
  profile,
  isEditing,
  setProfile,
}: VCardSectionsManagerProps) {
  const { selectedStyle } = useVCardStyle();
  const [newSkill, setNewSkill] = useState("");
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(
    profile.sections_order || ['header', 'bio', 'contact', 'skills', 'education', 'experience']
  );

  // Memoize handlers to prevent unnecessary re-renders
  const handleAddSkill = useCallback(() => {
    if (!newSkill.trim()) {
      toast.error("Veuillez entrer une compétence");
      return;
    }

    if (profile.skills?.includes(newSkill)) {
      toast.error("Cette compétence existe déjà");
      return;
    }

    const updatedSkills = [...(profile.skills || []), newSkill];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill("");
    toast.success("Compétence ajoutée");
  }, [newSkill, profile, setProfile]);

  const handleRemoveSkill = useCallback((skill: string) => {
    const updatedSkills = (profile.skills || []).filter(s => s !== skill);
    setProfile({ ...profile, skills: updatedSkills });
    toast.success("Compétence supprimée");
  }, [profile, setProfile]);

  // Update sections order when profile changes
  useEffect(() => {
    if (profile.sections_order && 
        JSON.stringify(profile.sections_order) !== JSON.stringify(sectionsOrder)) {
      setSectionsOrder(profile.sections_order);
    }
  }, [profile.sections_order]);

  // Save sections order when it changes
  const handleSectionsOrderChange = useCallback((newOrder: string[]) => {
    setSectionsOrder(newOrder);
    setProfile({ ...profile, sections_order: newOrder });
  }, [profile, setProfile]);

  return (
    <VCardSections
      profile={profile}
      isEditing={isEditing}
      setProfile={setProfile}
      newSkill={newSkill}
      setNewSkill={setNewSkill}
      handleAddSkill={handleAddSkill}
      handleRemoveSkill={handleRemoveSkill}
      selectedStyle={selectedStyle}
      sectionsOrder={sectionsOrder}
    />
  );
}