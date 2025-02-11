
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, UserX, MessageCircle, Lock } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfilePreviewButtonsProps {
  profile: UserProfile;
  onClose: () => void;
  canViewFullProfile: boolean;
}

export function ProfilePreviewButtons({
  profile,
  onClose,
  canViewFullProfile
}: ProfilePreviewButtonsProps) {
  const navigate = useNavigate();
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

  const handleActionWithToast = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleViewProfile = () => {
    if (!canViewFullProfile) {
      toast.error("Ce profil est privé. Vous devez être ami avec cet utilisateur pour voir son profil complet.");
      return;
    }
    window.location.href = `/profile/${profile.id}`;
    onClose();
  };

  const handleMessageClick = () => {
    navigate(`/messages?receiver=${profile.id}`);
    onClose();
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button 
        onClick={handleViewProfile}
        variant={canViewFullProfile ? "default" : "secondary"}
        className="w-full flex items-center gap-2 relative z-10"
      >
        {canViewFullProfile ? (
          "Voir le profil complet"
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
          className="w-full flex items-center gap-2 relative z-10"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter en ami
        </Button>
      )}

      {isFriendRequestReceived && (
        <Button
          onClick={() => handleActionWithToast(handleAcceptFriend, "Demande d'ami acceptée")}
          variant="default"
          className="w-full flex items-center gap-2 relative z-10"
        >
          <UserPlus className="h-4 w-4" />
          Accepter la demande
        </Button>
      )}

      {(isFriend || isFriendRequestSent) && (
        <Button
          onClick={() => handleActionWithToast(handleRemoveFriend, 
            isFriend ? "Ami retiré" : "Demande annulée")}
          variant="outline"
          className="w-full flex items-center gap-2 text-destructive hover:text-destructive relative z-10"
        >
          <UserMinus className="h-4 w-4" />
          {isFriend ? "Retirer des amis" : "Annuler la demande"}
        </Button>
      )}

      <Button
        onClick={() => handleActionWithToast(handleToggleBlock, 
          isBlocked ? "Utilisateur débloqué" : "Utilisateur bloqué")}
        variant="outline"
        className="w-full flex items-center gap-2 relative z-10"
      >
        <UserX className="h-4 w-4" />
        {isBlocked ? "Débloquer" : "Bloquer"}
      </Button>

      {isFriend && !isBlocked && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 relative z-10"
          onClick={handleMessageClick}
        >
          <MessageCircle className="h-4 w-4" />
          Envoyer un message
        </Button>
      )}
    </div>
  );
}
