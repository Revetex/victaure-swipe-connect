import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  if (!profile || profile.privacy_enabled) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
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