import { VCardContact } from "@/components/VCardContact";
import { VCardContent } from "../../VCardContent";
import { VCardHeader } from "@/components/VCardHeader";
import { VCardStyleSelector } from "../../VCardStyleSelector";
import { styleOptions } from "../../styles";

export function VCardExpandedGrid({ profile, isEditing, setProfile, selectedStyle, onStyleSelect, newSkill, setNewSkill }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <VCardContact
          profile={profile}
          isEditing={isEditing}
          onUpdate={(field, value) => {
            if (profile) {
              setProfile({ ...profile, [field]: value });
            }
          }}
        />
      </div>
      <div className="space-y-8">
        <VCardStyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={onStyleSelect}
          isEditing={isEditing}
        />
        
        <VCardHeader
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />

        <VCardContent
          profile={profile}
          isEditing={isEditing}
          selectedStyle={selectedStyle}
          setProfile={setProfile}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={() => {
            if (!profile || !newSkill.trim()) return;
            const updatedSkills = [...(profile.skills || []), newSkill.trim()];
            setProfile({ ...profile, skills: updatedSkills });
            setNewSkill("");
          }}
          handleRemoveSkill={(skillToRemove: string) => {
            if (!profile) return;
            const updatedSkills = (profile.skills || []).filter(
              (skill) => skill !== skillToRemove
            );
            setProfile({ ...profile, skills: updatedSkills });
          }}
        />
      </div>
    </div>
  );
}