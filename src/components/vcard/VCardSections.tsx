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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 w-full"
    >
      {sectionsOrder.map((section) => {
        // Always show sections in edit mode, or if they have content
        if (!isEditing && !hasSectionContent(section)) {
          return null;
        }

        switch (section) {
          case 'bio':
            return (
              <VCardBioSection
                key={section}
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            );
          case 'skills':
            return (
              <VCardSkillsSection
                key={section}
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
                handleRemoveSkill={handleRemoveSkill}
                selectedStyle={selectedStyle}
              />
            );
          case 'education':
            return (
              <VCardEducationSection
                key={section}
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            );
          case 'experience':
            return (
              <VCardExperienceSection
                key={section}
                profile={profile}
                isEditing={isEditing}
                setProfile={setProfile}
              />
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}