import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={isFlipped ? "back" : "front"}
          initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
          animate={{ opacity: 1, rotateY: isFlipped ? 0 : 0 }}
          exit={{ opacity: 0, rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.4 }}
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
          className="w-full"
        >
          {!isFlipped ? (
            <ProfilePreviewFront
              profile={profile}
              onRequestChat={onRequestChat}
              onFlip={handleFlip}
            />
          ) : (
            <ProfilePreviewBack 
              profile={profile} 
              onFlip={handleFlip} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}