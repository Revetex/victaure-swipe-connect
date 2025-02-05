import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose: () => void;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onClose,
}: ProfilePreviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
        animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
        exit={{ opacity: 0, rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {!isFlipped ? (
          <ProfilePreviewFront
            profile={profile}
            onRequestChat={onRequestChat}
            onFlip={() => setIsFlipped(true)}
          />
        ) : (
          <ProfilePreviewBack
            profile={profile}
            onFlip={() => setIsFlipped(false)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}