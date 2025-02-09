
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProfilePreviewCard } from "./ProfilePreviewCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            className="max-w-md p-6 overflow-hidden bg-transparent border-none shadow-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <VisuallyHidden>
                <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
              </VisuallyHidden>
              <ProfilePreviewCard
                profile={profile}
                onRequestChat={onRequestChat}
                onClose={onClose}
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
