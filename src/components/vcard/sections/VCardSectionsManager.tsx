import { UserProfile } from "@/types/profile";
import { VCardHeader } from "../../VCardHeader";
import { VCardBio } from "../../VCardBio";
import { VCardContact } from "../../VCardContact";
import { VCardContent } from "../VCardContent";
import { VCardEducation } from "../../VCardEducation";
import { VCardExperiences } from "../../VCardExperiences";
import { StyleOption } from "../types";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

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
  const isMobile = useIsMobile();

  const handleAddSkill = () => {
    if (!profile || !newSkill) return;
    const updatedSkills = [...(profile.skills || []), newSkill];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = profile.skills?.filter(skill => skill !== skillToRemove) || [];
    setProfile({ ...profile, skills: updatedSkills });
  };

  const defaultSectionsOrder = ['header', 'bio', 'contact', 'education', 'experience', 'skills'];
  const sectionsOrder = profile.sections_order || defaultSectionsOrder;

  const renderSection = (sectionId: string) => {
    const props = {
      profile,
      isEditing,
      setProfile,
      selectedStyle,
      newSkill,
      setNewSkill,
      handleAddSkill,
      handleRemoveSkill,
    };

    switch (sectionId) {
      case 'header':
        return <VCardHeader {...props} />;
      case 'bio':
        return <VCardBio {...props} />;
      case 'contact':
        return <VCardContact {...props} />;
      case 'education':
        return <VCardEducation {...props} />;
      case 'experience':
        return <VCardExperiences {...props} />;
      case 'skills':
        return <VCardContent {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {sectionsOrder.map((sectionId) => (
          <motion.div
            key={sectionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              ${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors' : ''}
              ${isMobile && isEditing ? 'p-4 touch-manipulation' : ''}
            `}
          >
            {renderSection(sectionId)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}