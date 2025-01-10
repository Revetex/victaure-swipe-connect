import { UserProfile } from "@/types/profile";
import { VCardHeader } from "./VCardHeader";
import { VCardBio } from "./VCardBio";
import { VCardContact } from "./VCardContact";
import { VCardContent } from "./VCardContent";
import { VCardEducation } from "./VCardEducation";
import { VCardExperiences } from "./VCardExperiences";
import { StyleOption } from "./types";

interface VCardSectionsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
  selectedStyle: StyleOption;
  sectionsOrder: string[];
}

export function VCardSections({
  profile,
  isEditing,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
  selectedStyle,
  sectionsOrder,
}: VCardSectionsProps) {
  const renderSection = (sectionId: string, index: number) => {
    const uniqueKey = `${sectionId}-${index}`;
    
    switch (sectionId) {
      case 'header':
        return (
          <VCardHeader
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            selectedStyle={selectedStyle}
            onProfileUpdate={setProfile}
          />
        );
      case 'bio':
        return (
          <VCardBio
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'contact':
        return (
          <VCardContact
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'skills':
        return (
          <VCardContent
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
            selectedStyle={selectedStyle}
          />
        );
      case 'education':
        return (
          <VCardEducation
            key={uniqueKey}
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'experience':
        return (
          <VCardExperiences
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