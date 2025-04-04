import { UserProfile } from "@/types/profile";
import { VCardContent } from "../VCardContent";
import { StyleOption } from "../types";
import { motion } from "framer-motion";

interface VCardSkillsSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  handleRemoveSkill: (skill: string) => void;
  selectedStyle: StyleOption;
}

export function VCardSkillsSection({
  profile,
  isEditing,
  setProfile,
  handleRemoveSkill,
  selectedStyle,
}: VCardSkillsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <VCardContent
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={handleRemoveSkill}
        selectedStyle={selectedStyle}
      />
    </motion.div>
  );
}