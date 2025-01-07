import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "../types";
import { VCardSections } from "../VCardSections";

interface VCardSectionsManagerProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  selectedStyle: StyleOption;
}

export function VCardSectionsManager({
  profile,
  isEditing,
  setProfile,
  selectedStyle,
}: VCardSectionsManagerProps) {
  const [newSkill, setNewSkill] = useState("");
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.sections_order) {
      const uniqueSections = Array.from(new Set(profile.sections_order));
      if (uniqueSections.length !== profile.sections_order.length) {
        setProfile({
          ...profile,
          sections_order: uniqueSections
        });
      }
      setSectionsOrder(uniqueSections);
    } else {
      setSectionsOrder(['header', 'bio', 'contact', 'skills', 'education', 'experience']);
    }
  }, [profile, setProfile]);

  const handleAddSkill = () => {
    if (!profile || !newSkill.trim()) return;
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    setProfile({ ...profile, skills: Array.from(new Set(updatedSkills)) });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = (profile.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    setProfile({ ...profile, skills: updatedSkills });
  };

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