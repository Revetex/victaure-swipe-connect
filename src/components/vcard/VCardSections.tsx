
import { UserProfile } from "@/types/profile";
import { StyleOption } from "./types";
import { VCardSection } from "@/components/VCardSection";
import { VCardBio } from "@/components/VCardBio";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardExperiences } from "@/components/vcard/VCardExperiences";
import { GraduationCap, Briefcase, Heart, Phone, User2 } from "lucide-react";

interface VCardSectionsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skillToRemove: string) => void;
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
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'bio':
        return (
          <VCardSection key="bio" title="À propos" icon={<User2 />}>
            <VCardBio 
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </VCardSection>
        );
      case 'contact':
        return (
          <VCardSection key="contact" title="Contact" icon={<Phone />}>
            <VCardContact 
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </VCardSection>
        );
      case 'skills':
        return (
          <VCardSection key="skills" title="Compétences" icon={<Heart />}>
            <VCardSkills
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
              handleRemoveSkill={handleRemoveSkill}
            />
          </VCardSection>
        );
      case 'education':
        return (
          <VCardSection 
            key="education" 
            title="Formation" 
            icon={<GraduationCap />}
            variant="education"
          >
            <VCardEducation
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </VCardSection>
        );
      case 'experience':
        return (
          <VCardSection 
            key="experience" 
            title="Expérience" 
            icon={<Briefcase />}
            variant="experience"
          >
            <VCardExperiences
              profile={profile}
              isEditing={isEditing}
              setProfile={setProfile}
            />
          </VCardSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {sectionsOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
