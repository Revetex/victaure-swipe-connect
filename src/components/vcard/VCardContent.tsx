import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { VCardHeader } from "@/components/VCardHeader";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardExperiences } from "@/components/VCardExperiences";
import { StyleOption } from "./types";

interface VCardContentProps {
  profile: UserProfile;
  isEditing: boolean;
  selectedStyle: StyleOption;
  setProfile: (profile: UserProfile) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
}

export function VCardContent({
  profile,
  isEditing,
  selectedStyle,
  setProfile,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill
}: VCardContentProps) {
  return (
    <motion.div className="space-y-8 pt-6">
      <VCardSkills
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        handleAddSkill={handleAddSkill}
        handleRemoveSkill={handleRemoveSkill}
      />

      <VCardExperiences
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <VCardCertifications
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />

      <VCardEducation
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />
    </motion.div>
  );
}