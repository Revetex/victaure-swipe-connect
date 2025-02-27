
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { useState } from "react";
import { ProfilePreviewButtons } from "./ProfilePreviewButtons";

interface ProfilePreviewModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile: boolean;
  onImageClick?: () => void;
  onViewProfile: () => void;
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
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const renderCardContent = () => {
    if (flipped) {
      return (
        <ProfilePreviewBack 
          profile={profile} 
          onFlip={handleFlip} 
          canViewFullProfile={canViewFullProfile}
        />
      );
    }

    return (
      <ProfilePreviewFront 
        profile={profile} 
        onRequestChat={onRequestChat} 
        onFlip={handleFlip}
        canViewFullProfile={canViewFullProfile}
        onClose={onClose}
        onViewProfile={onViewProfile}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={cn(
          "relative w-full max-w-md bg-card shadow-xl rounded-lg overflow-hidden",
          "border border-border/30 backdrop-filter backdrop-blur-md bg-opacity-80",
          "transition-all duration-500 transform-gpu"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-background/30 flex items-center justify-center hover:bg-background/50 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>

        {renderCardContent()}
        
        <div className="p-4 border-t bg-card/80 backdrop-blur-sm">
          <ProfilePreviewButtons 
            profileId={profile.id}
            onMessage={onRequestChat}
            showMessageButton={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
