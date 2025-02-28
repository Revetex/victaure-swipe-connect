
import { UserProfile } from "@/types/profile";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[98]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 z-[99] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-full max-w-lg mx-4"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30 
              }}
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
                <div className="sticky bottom-0 border-t bg-background p-4">
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
        </>
      )}
    </AnimatePresence>
  );
}
