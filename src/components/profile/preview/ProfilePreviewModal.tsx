
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { ProfilePreviewDialog } from "./ProfilePreviewDialog";
import { ProfilePreviewButtons } from "./ProfilePreviewButtons";

export interface ProfilePreviewModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile?: boolean;
  onImageClick?: () => void;
  onViewProfile?: () => void;
}

export function ProfilePreviewModal({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile = false,
  onImageClick,
  onViewProfile,
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80"
        onClick={onClose}
      />
      
      <motion.div 
        className="relative z-[99] w-full max-w-lg mx-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
      >
        <div className="bg-background rounded-lg shadow-lg overflow-hidden max-h-[85vh] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ProfilePreviewDialog
              profile={profile}
              isOpen={isOpen}
              onClose={onClose}
              onRequestChat={onRequestChat}
              canViewFullProfile={canViewFullProfile}
              onImageClick={onImageClick}
            />
          </div>
          <div className="border-t bg-background p-4">
            <ProfilePreviewButtons
              profile={profile}
              onRequestChat={onRequestChat}
              onClose={onClose}
              canViewFullProfile={canViewFullProfile}
              onViewProfile={onViewProfile}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
