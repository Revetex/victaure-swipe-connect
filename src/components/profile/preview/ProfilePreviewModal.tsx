
import { UserProfile } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";

interface ProfilePreviewModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile: boolean;
  onImageClick?: () => void;
  onViewProfile?: () => void;
}

export function ProfilePreviewModal({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile,
  onImageClick,
  onViewProfile
}: ProfilePreviewModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          className={cn(
            "relative perspective w-full max-w-md m-4 shadow-xl",
            "transform-gpu transition-all duration-500"
          )}
          style={{ 
            height: "550px"
          }}
        >
          <div 
            className="absolute w-full h-full transition-transform duration-700"
            style={{ 
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
          >
            {/* Front side */}
            <ProfilePreviewFront 
              profile={profile}
              onFlip={handleFlip}
              onRequestChat={onRequestChat}
              onImageClick={onImageClick}
              canViewFullProfile={canViewFullProfile}
              onViewProfile={onViewProfile}
            />

            {/* Back side */}
            <ProfilePreviewBack 
              profile={profile}
              onFlip={handleFlip}
              canViewFullProfile={canViewFullProfile}
            />
          </div>

          {/* Floating Close Button */}
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/60 hover:bg-background/80 z-50 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
