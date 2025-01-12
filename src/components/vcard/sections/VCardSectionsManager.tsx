import { VCardEducation } from "@/components/VCardEducation";
import { VCardExperiences } from "@/components/VCardExperiences";
import { VCardSkills } from "@/components/VCardSkills";
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
  const customStyles = {
    font: profile.custom_font,
    background: profile.custom_background,
    textColor: profile.custom_text_color
  };

  return (
    <div className="space-y-8">
      <VCardSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={(skill: string) => {
          const updatedSkills = profile.skills?.filter(s => s !== skill) || [];
          setProfile({ ...profile, skills: updatedSkills });
        }}
        customStyles={customStyles}
      />

      <VCardEducation
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        customStyles={customStyles}
      />

      <VCardExperiences
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        customStyles={customStyles}
      />
    </div>
  );
}