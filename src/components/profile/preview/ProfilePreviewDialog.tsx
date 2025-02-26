
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";
import { useState } from "react";

export interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile?: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile = false,
  onImageClick,
}: ProfilePreviewDialogProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#1B2A4A] border border-white/10">
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 0 : 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 0 : 180 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="relative"
          >
            {!isFlipped ? (
              <ProfilePreviewFront
                profile={profile}
                onRequestChat={onRequestChat}
                onFlip={() => setIsFlipped(true)}
                canViewFullProfile={canViewFullProfile}
                onClose={onClose}
                onViewProfile={() => {}}
              />
            ) : (
              <ProfilePreviewBack
                profile={profile}
                onFlip={() => setIsFlipped(false)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
