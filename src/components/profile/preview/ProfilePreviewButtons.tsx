
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, UserX, MessageCircle, Lock, ExternalLink } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
  onViewProfile,
}: ProfilePreviewButtonsProps) {
  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived
  } = useConnectionStatus(profile.id);

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
  } = useConnectionActions(profile.id);

  const handleActionWithToast = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    onClose();
    navigate(`/messages?receiver=${profile.id}`);
  };

  const handleViewProfileClick = () => {
    if (!canViewFullProfile) {
      toast.error("Ce profil est privé");
      return;
    }
    onClose();
    navigate(`/profile/${profile.id}`);
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        onClick={handleViewProfileClick}
        variant={canViewFullProfile ? "default" : "secondary"}
        className="w-full flex items-center gap-2"
      >
        {canViewFullProfile ? (
          <>
            <ExternalLink className="h-4 w-4" />
            Voir le profil
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Profil privé
          </>
        )}
      </Button>

      {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
        <Button 
          onClick={() => handleActionWithToast(handleAddFriend, "Demande d'ami envoyée")}
          variant="default" 
          className="w-full flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter
        </Button>
      )}

      {isFriendRequestReceived && (
        <Button
          onClick={() => handleActionWithToast(handleAcceptFriend, "Demande d'ami acceptée")}
          variant="default"
          className="w-full flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Accepter
        </Button>
      )}

      {(isFriend || isFriendRequestSent) && (
        <Button
          onClick={() => handleActionWithToast(handleRemoveFriend, 
            isFriend ? "Ami retiré" : "Demande annulée")}
          variant="outline"
          className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <UserMinus className="h-4 w-4" />
          {isFriend ? "Retirer" : "Annuler"}
        </Button>
      )}

      {isFriend && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleMessageClick}
        >
          <MessageCircle className="h-4 w-4" />
          Message
        </Button>
      )}

      <Button
        onClick={() => handleActionWithToast(handleToggleBlock, 
          isBlocked ? "Utilisateur débloqué" : "Utilisateur bloqué")}
        variant="outline"
        className="w-full flex items-center gap-2 col-span-full"
      >
        <UserX className="h-4 w-4" />
        {isBlocked ? "Débloquer" : "Bloquer"}
      </Button>
    </motion.div>
  );
}
