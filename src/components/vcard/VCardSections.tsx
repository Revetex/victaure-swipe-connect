import { UserProfile } from "@/types/profile";
import { VCardHeader } from "../VCardHeader";
import { VCardBio } from "../VCardBio";
import { VCardContact } from "../VCardContact";
import { VCardSkills } from "../VCardSkills";
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
          <div key={uniqueKey} className="w-full">
            <VCardHeader
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'contact':
        return (
          <div key={uniqueKey} className="w-full mt-4">
            <VCardContact
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'bio':
        return (
          <div key={uniqueKey} className="w-full mt-6">
            <VCardBio
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              customStyles={customStyles}
            />
          </div>
        );
      case 'skills':
        return (
          <div key={uniqueKey} className="w-full mt-6">
            <VCardSkills
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              handleRemoveSkill={handleRemoveSkill}
            />
          </div>
        );
      case 'education':
        return (
          <div key={uniqueKey} className="w-full mt-6">
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
          <div key={uniqueKey} className="w-full mt-6">
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
      className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6"
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {sectionsOrder
            .filter(section => ['header', 'contact', 'bio', 'education', 'experience'].includes(section))
            .map((sectionId, index) => renderSection(sectionId, index))}
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          {sectionsOrder
            .filter(section => ['skills'].includes(section))
            .map((sectionId, index) => renderSection(sectionId, index))}
        </div>
      </div>
    </div>
  );
}