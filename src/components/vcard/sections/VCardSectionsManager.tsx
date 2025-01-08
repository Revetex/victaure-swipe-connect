import { UserProfile } from "@/types/profile";
import { VCardHeader } from "../../VCardHeader";
import { VCardBio } from "../../VCardBio";
import { VCardContact } from "../../VCardContact";
import { VCardContent } from "../VCardContent";
import { VCardEducation } from "../../VCardEducation";
import { VCardExperiences } from "../../VCardExperiences";
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
  // Default sections order if none is specified in profile
  const defaultSectionsOrder = ['header', 'bio', 'contact', 'education', 'experience', 'skills'];
  const sectionsOrder = profile.sections_order || defaultSectionsOrder;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <VCardHeader
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'bio':
        return (
          <VCardBio
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'contact':
        return (
          <VCardContact
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'education':
        return (
          <VCardEducation
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'experience':
        return (
          <VCardExperiences
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
          />
        );
      case 'skills':
        return (
          <VCardContent
            profile={profile}
            isEditing={isEditing}
            setProfile={setProfile}
            selectedStyle={selectedStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {sectionsOrder.map((sectionId) => (
        <div
          key={sectionId}
          className={`${isEditing ? 'hover:bg-accent/50 rounded-lg transition-colors' : ''}`}
        >
          {renderSection(sectionId)}
        </div>
      ))}
    </div>
  );
}