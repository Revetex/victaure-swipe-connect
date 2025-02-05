import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";

interface ProfilePreviewBioProps {
  profile: UserProfile;
}

export function ProfilePreviewBio({ profile }: ProfilePreviewBioProps) {
  if (!profile.bio) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-medium">Bio</h3>
      <p className="text-sm text-muted-foreground">{profile.bio}</p>
    </motion.div>
  );
}