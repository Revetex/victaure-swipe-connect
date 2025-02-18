
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "../types";
import { VCardSections } from "../VCardSections";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = (profile.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    setProfile({ ...profile, skills: updatedSkills });
  };

  const addEducation = () => {
    const newEducation = {
      school: "",
      degree: "",
      field: "",
      start_date: "",
      end_date: "",
      current: false,
      description: ""
    };
    setProfile({
      ...profile,
      education: [...(profile.education || []), newEducation]
    });
  };

  const addSkill = () => {
    // Cette fonction sera appelée par le composant TouchFriendlySkillSelector
  };

  const renderAddButton = (type: "education" | "skill") => (
    <Button
      variant="outline"
      size="sm"
      onClick={type === "education" ? addEducation : addSkill}
      className="bg-white/5 hover:bg-white/10 border-purple-500/20 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      {type === "education" ? "Ajouter une formation" : "Ajouter une compétence"}
    </Button>
  );

  return (
    <VCardSections
      profile={profile}
      isEditing={isEditing}
      setProfile={setProfile}
      handleRemoveSkill={handleRemoveSkill}
      selectedStyle={selectedStyle}
      sectionsOrder={sectionsOrder}
      renderAddButton={renderAddButton}
    />
  );
}
