
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Ban, MessageCircle, Lock, ExternalLink } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProfilePreviewButtonsProps {
  profile: UserProfile;
  onClose: () => void;
  canViewFullProfile: boolean;
  onRequestChat?: () => void;
  onViewProfile?: () => void;
}

export function ProfilePreviewButtons({
  profile,
  onClose,
  canViewFullProfile,
  onRequestChat,
  onViewProfile
}: ProfilePreviewButtonsProps) {
  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
    isLoading
  } = useConnectionStatus(profile.id);

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
    isProcessing
  } = useConnectionActions(profile.id);

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }

    onClose();
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/messages?receiver=${profile.id}`);
    }
  };

  const handleViewProfileClick = () => {
    if (!canViewFullProfile) {
      toast.error("Ce profil est privé");
      return;
    }

    onClose();
    if (onViewProfile) {
      onViewProfile();
    } else {
      navigate(`/profile/${profile.id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
    >
      <Button
        onClick={handleViewProfileClick}
        className="w-full bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white"
        disabled={!canViewFullProfile}
      >
        {canViewFullProfile ? (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir le profil
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Profil privé
          </>
        )}
      </Button>

      {isLoading ? (
        <Button disabled className="w-full bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white">
          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Chargement...
        </Button>
      ) : (
        <>
          {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
            <Button 
              onClick={handleAddFriend}
              variant="default"
              disabled={isProcessing}
              className="w-full bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white"
            >
              {isProcessing ? (
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Ajouter
            </Button>
          )}

          {isFriendRequestReceived && (
            <Button
              onClick={handleAcceptFriend}
              variant="default"
              disabled={isProcessing}
              className="w-full bg-[#1A1F2C] hover:bg-[#1A1F2C]/90 text-white"
            >
              {isProcessing ? (
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Accepter
            </Button>
          )}

          {(isFriend || isFriendRequestSent) && (
            <Button
              onClick={handleRemoveFriend}
              variant="outline"
              disabled={isProcessing}
              className="w-full border-red-500/20 hover:bg-red-500/10 text-red-500"
            >
              {isProcessing ? (
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              ) : (
                <UserMinus className="mr-2 h-4 w-4" />
              )}
              {isFriend ? "Retirer" : "Annuler"}
            </Button>
          )}
        </>
      )}

      {isFriend && (
        <Button
          onClick={handleMessageClick}
          variant="outline"
          className="w-full col-span-full border-primary/20 hover:bg-primary/10 text-primary"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Envoyer un message
        </Button>
      )}

      <Button
        onClick={() => handleToggleBlock(profile.id)}
        variant="outline"
        disabled={isProcessing || isLoading}
        className="w-full border-muted hover:bg-muted/10 text-muted-foreground"
      >
        {isProcessing ? (
          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : (
          <Ban className="mr-2 h-4 w-4" />
        )}
        {isBlocked ? "Débloquer" : "Bloquer"}
      </Button>
    </motion.div>
  );
}
