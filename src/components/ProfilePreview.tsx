
import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

const MemoizedProfilePreviewDialog = memo(ProfilePreviewDialog);

export function ProfilePreview({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleRequestChat = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/dashboard/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-full p-0">
          <MemoizedProfilePreviewDialog
            profile={profile}
            isOpen={isOpen}
            onClose={onClose}
            onRequestChat={handleRequestChat}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
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
            <MemoizedProfilePreviewDialog
              profile={profile}
              isOpen={isOpen}
              onClose={onClose}
              onRequestChat={handleRequestChat}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
