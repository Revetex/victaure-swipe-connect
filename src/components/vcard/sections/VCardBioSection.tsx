
import { UserProfile } from "@/types/profile";
import { VCardBio } from "@/components/VCardBio";
import { motion } from "framer-motion";

interface VCardBioSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBioSection({ profile, isEditing, setProfile }: VCardBioSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      <motion.div 
        variants={itemVariants}
        className="relative w-full rounded-xl overflow-hidden backdrop-blur-sm
                   bg-gradient-to-br from-white/5 via-purple-500/5 to-white/5
                   dark:from-black/10 dark:via-purple-500/10 dark:to-black/10
                   border border-purple-500/10 dark:border-white/10
                   shadow-lg shadow-purple-500/5"
      >
        <VCardBio
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>
    </motion.div>
  );
}
