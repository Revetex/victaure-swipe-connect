
import { UserProfile } from "@/types/profile";
import { VCardExpandedHeader } from "./VCardExpandedHeader";
import { VCardExpandedBio } from "./VCardExpandedBio";
import { VCardExpandedEducation } from "./VCardExpandedEducation";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardExpandedQR } from "./VCardExpandedQR";

interface VCardExpandedGridProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExpandedGrid({
  profile,
  isEditing,
  setProfile,
}: VCardExpandedGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#F6F6F7] dark:bg-[#1A1F2C]">
      <div className="space-y-8">
        <VCardExpandedHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
        
        <VCardExpandedEducation
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </div>
      
      <div className="space-y-8">
        <VCardExpandedBio
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
        
        <VCardSkills
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          handleRemoveSkill={(skill: string) => {
            const updatedSkills = profile.skills?.filter(s => s !== skill) || [];
            setProfile({ ...profile, skills: updatedSkills });
          }}
        />
        
        <VCardExpandedQR />
      </div>
    </div>
  );
}
