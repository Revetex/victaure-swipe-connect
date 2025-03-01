
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  onViewProfile,
}: ProfilePreviewModalProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  if (!isOpen) return null;

  // Ensure we have a UserProfile with all required fields
  const safeProfile: UserProfile = {
    ...profile,
    avatar_url: profile.avatar_url || null,
    full_name: profile.full_name || '',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative bg-background rounded-lg overflow-hidden w-full max-w-md h-[500px]",
            "perspective-1000"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 text-foreground/80 hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>

          <div
            className={cn(
              "h-full w-full transition-transform duration-500",
              "preserve-3d relative",
              flipped ? "rotate-y-180" : ""
            )}
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front face */}
            <ProfilePreviewFront
              profile={safeProfile}
              onRequestChat={onRequestChat}
              onFlip={handleFlip}
              canViewFullProfile={canViewFullProfile}
              onViewProfile={onViewProfile}
            />

            {/* Back face */}
            <ProfilePreviewBack
              profile={safeProfile}
              onFlip={handleFlip}
              canViewFullProfile={canViewFullProfile}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
