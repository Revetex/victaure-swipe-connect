import { UserProfile } from "@/types/profile";
import { VCardHeader } from "../../VCardHeader";
import { VCardBio } from "../../VCardBio";
import { VCardContact } from "../../VCardContact";
import { VCardContent } from "../VCardContent";
import { VCardEducation } from "../../VCardEducation";
import { VCardExperiences } from "../../VCardExperiences";
import { StyleOption } from "../types";
import { useState } from "react";

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

  // Default sections order if none is specified in profile
  const defaultSectionsOrder = ['header', 'bio', 'contact', 'education', 'mission', 'skills'];
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
      case 'mission':
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
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
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