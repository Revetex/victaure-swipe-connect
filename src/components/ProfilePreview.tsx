
import { UserProfile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "./profile/preview/ProfileHeader";
import { ProfileActions } from "./profile/preview/ProfileActions";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useConnectionActions } from "./profile/preview/hooks/useConnectionActions";
import { toast } from "sonner";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
  } = useConnectionActions(profile.id);

  const handleViewProfile = () => {
    if (!profile.privacy_enabled || isOwnProfile || isFriend) {
      navigate(`/profile/${profile.id}`);
      onClose();
    } else {
      toast.error("Ce profil est privé");
    }
  };

  const handleMessageClick = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  const previewContent = (
    <div className="flex flex-col space-y-6">
      <ProfileHeader profile={profile} />
      <ProfileActions
        isOwnProfile={isOwnProfile}
        isFriend={isFriend}
        isBlocked={isBlocked}
        isFriendRequestSent={isFriendRequestSent}
        isFriendRequestReceived={isFriendRequestReceived}
        isPrivate={!!profile.privacy_enabled}
        onViewProfile={handleViewProfile}
        onAddFriend={handleAddFriend}
        onAcceptFriend={handleAcceptFriend}
        onRemoveFriend={handleRemoveFriend}
        onToggleBlock={handleToggleBlock}
        onMessage={handleMessageClick}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          {previewContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6 border">
              {previewContent}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
