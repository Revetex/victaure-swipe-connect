
import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  if (!profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Informations détaillées du profil de {profile.full_name || "l'utilisateur"}
          </DialogDescription>
        </VisuallyHidden>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <VCard profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
