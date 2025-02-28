
import { UserProfile } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, User } from "lucide-react";
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "relative perspective w-full max-w-md rounded-lg shadow-lg",
            "transform-gpu", // Pour une meilleure performance d'animation
            "transition-all duration-500"
          )}
          style={{ 
            height: "550px",
            transformStyle: "preserve-3d"
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
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 z-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </motion.div>

        {/* Bottom Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute bottom-4 flex justify-center gap-2 z-50 w-full px-4"
        >
          {onRequestChat && (
            <Button
              variant="default"
              onClick={onRequestChat}
              className="rounded-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Envoyer un message
            </Button>
          )}
          
          {onViewProfile && (
            <Button
              variant="outline"
              onClick={onViewProfile}
              className="rounded-full bg-background/50 hover:bg-background"
            >
              <User className="mr-2 h-4 w-4" />
              Voir le profil
            </Button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
