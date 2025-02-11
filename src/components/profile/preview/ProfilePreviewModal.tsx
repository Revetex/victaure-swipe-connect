
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { ProfilePreviewDialog } from "./ProfilePreviewDialog";
import { ProfilePreviewButtons } from "./ProfilePreviewButtons";

interface ProfilePreviewModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile?: boolean;
}

export function ProfilePreviewModal({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile = false,
}: ProfilePreviewModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30 
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(4px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        className="absolute inset-0 bg-background/80"
        onClick={onClose}
      />
      
      <motion.div 
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
      >
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
          <ProfilePreviewDialog
            profile={profile}
            isOpen={isOpen}
            onClose={onClose}
            onRequestChat={onRequestChat}
            canViewFullProfile={canViewFullProfile}
          />
          <ProfilePreviewButtons
            profile={profile}
            onRequestChat={onRequestChat}
            onClose={onClose}
            canViewFullProfile={!!canViewFullProfile}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
