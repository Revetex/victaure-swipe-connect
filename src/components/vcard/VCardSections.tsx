
import { UserProfile } from "@/types/profile";
import { VCardBioSection } from "./sections/VCardBioSection";
import { VCardSkillsSection } from "./sections/VCardSkillsSection";
import { VCardEducationSection } from "./sections/VCardEducationSection";
import { VCardExperienceSection } from "./sections/VCardExperienceSection";
import { StyleOption } from "./types";
import { motion } from "framer-motion";

interface VCardSectionsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
  selectedStyle: StyleOption;
  sectionsOrder: string[];
}

export function VCardSections({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
  selectedStyle,
  sectionsOrder,
}: VCardSectionsProps) {
  // Helper function to check if a section has content
  const hasSectionContent = (sectionName: string): boolean => {
    switch (sectionName) {
      case 'bio':
        return Boolean(profile.bio);
      case 'skills':
        return Array.isArray(profile.skills) && profile.skills.length > 0;
      case 'education':
        return Array.isArray(profile.education) && profile.education.length > 0;
      case 'experience':
        return Array.isArray(profile.experiences) && profile.experiences.length > 0;
      default:
        return true;
    }
  };

  // Animation variants for consistent animation across sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 w-full backdrop-blur-sm"
    >
      {sectionsOrder.map((section, index) => {
        // Always show sections in edit mode, or if they have content
        if (!isEditing && !hasSectionContent(section)) {
          return null;
        }

        return (
          <motion.div
            key={section}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="overflow-hidden"
          >
            {section === 'bio' && (
              <VCardBioSection
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            )}
            
            {section === 'skills' && (
              <VCardSkillsSection
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
                handleRemoveSkill={handleRemoveSkill}
                selectedStyle={selectedStyle}
              />
            )}
            
            {section === 'education' && (
              <VCardEducationSection
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            )}
            
            {section === 'experience' && (
              <VCardExperienceSection
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
