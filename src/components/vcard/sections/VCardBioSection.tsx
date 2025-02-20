import { UserProfile } from "@/types/profile";
import { VCardBio } from "@/components/VCardBio";
import { motion } from "framer-motion";

interface VCardBioSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBioSection({ profile, isEditing, setProfile }: VCardBioSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <VCardBio
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />
    </motion.div>
  );
}