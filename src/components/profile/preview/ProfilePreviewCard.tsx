import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { motion } from "framer-motion";

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
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative preserve-3d" style={{ perspective: "1000px" }}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full"
        >
          {!isFlipped ? (
            <ProfilePreviewFront
              profile={profile}
              onRequestChat={onRequestChat}
              onFlip={handleFlip}
            />
          ) : (
            <ProfilePreviewBack profile={profile} onFlip={handleFlip} />
          )}
        </motion.div>
      </div>
    </div>
  );
}