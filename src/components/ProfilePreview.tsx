
import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleRequestChat = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/dashboard/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30 
          }}
        >
          <ProfilePreviewDialog
            profile={profile}
            isOpen={isOpen}
            onClose={onClose}
            onRequestChat={handleRequestChat}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
