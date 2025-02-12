
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { toast } from "sonner";

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
  const navigate = useNavigate();
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
    if (!profile.privacy_enabled || isOwnProfile || isFriend || canViewFullProfile) {
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
          <div className="flex-1 overflow-y-auto p-6">
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
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
