import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";
import { VCardBioSection } from "./sections/VCardBioSection";
import { VCardSkillsSection } from "./sections/VCardSkillsSection";
import { VCardEducationSection } from "./sections/VCardEducationSection";
import { VCardExperienceSection } from "./sections/VCardExperienceSection";

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
  const renderSection = (sectionId: string, index: number) => {
    const uniqueKey = `${sectionId}-${index}`;
    
    switch (sectionId) {
      case 'bio':
        return (
          <VCardBioSection
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'skills':
        return (
          <VCardSkillsSection
            key={uniqueKey}
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
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'experience':
        return (
          <VCardExperienceSection
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {sectionsOrder.map((sectionId, index) => (
        <div
          key={`section-container-${sectionId}-${index}`}
          className={`${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors' : ''}`}
        >
          {renderSection(sectionId, index)}
        </div>
      ))}
    </div>
  );
}