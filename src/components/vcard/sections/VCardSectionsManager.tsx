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
    // Définir l'ordre par défaut avec contact avant bio
    const defaultOrder = ['header', 'contact', 'bio', 'skills', 'education', 'experience'];
    
    if (profile?.sections_order) {
      // Si l'ordre actuel a bio avant contact, on le corrige
      const currentOrder = profile.sections_order;
      const bioIndex = currentOrder.indexOf('bio');
      const contactIndex = currentOrder.indexOf('contact');
      
      if (bioIndex < contactIndex) {
        // Créer un nouvel ordre avec contact avant bio
        const newOrder = [...currentOrder];
        newOrder.splice(bioIndex, 1); // Retirer bio
        newOrder.splice(contactIndex - 1, 0, 'bio'); // Insérer bio après contact
        
        // Mettre à jour le profil avec le nouvel ordre
        setProfile({
          ...profile,
          sections_order: newOrder
        });
        setSectionsOrder(newOrder);
      } else {
        // L'ordre est déjà correct
        setSectionsOrder(currentOrder);
      }
    } else {
      // Utiliser l'ordre par défaut si aucun ordre n'est défini
      setSectionsOrder(defaultOrder);
      setProfile({
        ...profile,
        sections_order: defaultOrder
      });
    }
  }, [profile, setProfile]);

  const handleAddSkill = () => {
    if (!profile || !newSkill.trim()) return;
    
    // Ensure skills array exists and is unique
    const currentSkills = profile.skills || [];
    const newSkillTrimmed = newSkill.trim();
    
    if (!currentSkills.includes(newSkillTrimmed)) {
      const updatedSkills = [...currentSkills, newSkillTrimmed];
      setProfile({ ...profile, skills: updatedSkills });
    }
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