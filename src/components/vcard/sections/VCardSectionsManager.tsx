import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import {
  VCardBio,
  VCardContact,
  VCardEducation,
  VCardExperiences,
  VCardSkills,
  VCardHeader
} from "../index";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "../types";

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
      onProfileUpdate: setProfile
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
        return <VCardSkills {...props} />;
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