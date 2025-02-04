import { UserProfile } from "@/types/profile";
import { VCardExperiences } from "../VCardExperiences";
import { motion } from "framer-motion";

interface VCardExperienceSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperienceSection({
  profile,
  isEditing,
  setProfile,
}: VCardExperienceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <VCardExperiences
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />
    </motion.div>
  );
}