import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewHeader } from "./profile/preview/ProfilePreviewHeader";
import { ProfilePreviewBio } from "./profile/preview/ProfilePreviewBio";
import { ProfilePreviewSkills } from "./profile/preview/ProfilePreviewSkills";
import { ProfilePreviewContact } from "./profile/preview/ProfilePreviewContact";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreview({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] gap-4 overflow-y-auto max-h-[90vh] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ 
          position: 'fixed',
          zIndex: 9999,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <ProfilePreviewHeader 
              profile={profile}
              onRequestChat={onRequestChat}
            />
            
            <ProfilePreviewBio profile={profile} />
            <ProfilePreviewSkills profile={profile} />
            <ProfilePreviewContact profile={profile} />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}