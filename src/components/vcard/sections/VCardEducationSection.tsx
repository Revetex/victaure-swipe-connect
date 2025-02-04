import { UserProfile } from "@/types/profile";
import { VCardEducation } from "@/components/VCardEducation";
import { motion } from "framer-motion";

interface VCardEducationSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducationSection({
  profile,
  isEditing,
  setProfile,
}: VCardEducationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <VCardEducation
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />
    </motion.div>
  );
}