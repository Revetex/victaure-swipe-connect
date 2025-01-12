import { UserProfile } from "@/types/profile";
import { VCardHeader } from "../VCardHeader";
import { VCardBio } from "../VCardBio";
import { VCardContact } from "../VCardContact";
import { VCardContent } from "./VCardContent";
import { VCardEducation } from "../VCardEducation";
import { VCardExperiences } from "../VCardExperiences";
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
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
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
  customStyles,
}: VCardSectionsProps) {
  const renderSection = (sectionId: string, index: number) => {
    const uniqueKey = `${sectionId}-${index}`;
    
    switch (sectionId) {
      case 'header':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardHeader
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'bio':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardBio
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'contact':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardContact
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'skills':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardContent
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
              selectedStyle={selectedStyle}
              customStyles={customStyles}
            />
          </div>
        );
      case 'education':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardEducation
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'experience':
        return (
          <div key={uniqueKey} className="w-full px-4 sm:px-6 md:px-8">
            <VCardExperiences
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-8"
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <div className="lg:col-span-8 space-y-8">
        {sectionsOrder
          .filter(section => ['header', 'bio', 'education', 'experience'].includes(section))
          .map((sectionId, index) => (
            <div
              key={`section-container-${sectionId}-${index}`}
              className={`${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors p-4' : ''}`}
            >
              {renderSection(sectionId, index)}
            </div>
          ))}
      </div>
      
      <div className="lg:col-span-4 space-y-8">
        {sectionsOrder
          .filter(section => ['contact', 'skills'].includes(section))
          .map((sectionId, index) => (
            <div
              key={`section-container-${sectionId}-${index}`}
              className={`${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors p-4' : ''}`}
            >
              {renderSection(sectionId, index)}
            </div>
          ))}
      </div>
    </div>
  );
}