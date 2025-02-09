
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

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
      <div className="absolute -top-2 right-2 z-20">
        <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
          <Shield className="w-3 h-3" />
          <span>Profil vérifié</span>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isFlipped ? "back" : "front"}
          initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
          animate={{ opacity: 1, rotateY: isFlipped ? 0 : 0 }}
          exit={{ opacity: 0, rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
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
              onRequestChat={onRequestChat}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
