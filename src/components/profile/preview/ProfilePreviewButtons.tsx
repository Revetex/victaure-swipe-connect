
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Check, 
  X, 
  MessageSquare, 
  UserX,
  Shield,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";

interface ProfilePreviewButtonsProps {
  profileId: string;
  onMessage?: () => void;
  showMessageButton?: boolean;
}

export function ProfilePreviewButtons({
  profileId,
  onMessage,
  showMessageButton = true
}: ProfilePreviewButtonsProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profileId;
  
  const { 
    isFriend, 
    isFriendRequestSent, 
    isFriendRequestReceived,
    isBlocked
  } = useConnectionStatus(profileId);

  const { 
    isLoading,
    handleAddFriend, 
    handleAcceptFriend, 
    handleRemoveFriend,
    handleToggleBlock
  } = useConnectionActions(profileId);

  // Si c'est le profil de l'utilisateur connecté
  if (isOwnProfile) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      {/* Ami déjà ajouté */}
      {isFriend && (
        <>
          {showMessageButton && (
            <Button 
              onClick={onMessage}
              className="flex-1 gap-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => handleRemoveFriend()}
            disabled={isLoading}
            className="flex-1 gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserX className="h-4 w-4" />
            )}
            Retirer
          </Button>
        </>
      )}

      {/* Demande d'ami reçue mais pas encore acceptée */}
      {isFriendRequestReceived && (
        <>
          <Button 
            variant="default" 
            onClick={() => handleAcceptFriend()}
            disabled={isLoading}
            className="flex-1 gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accepter
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleRemoveFriend()}
            disabled={isLoading}
            className="flex-1 gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Refuser
          </Button>
        </>
      )}

      {/* Demande d'ami envoyée mais pas encore acceptée */}
      {isFriendRequestSent && (
        <Button 
          variant="outline" 
          onClick={() => handleRemoveFriend()}
          disabled={isLoading}
          className="flex-1 gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Annuler la demande
        </Button>
      )}

      {/* Aucune relation d'amitié */}
      {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && (
        <Button 
          variant="default" 
          onClick={() => handleAddFriend()}
          disabled={isLoading}
          className="flex-1 gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Ajouter
        </Button>
      )}

      {/* Boutons supplémentaires (contact, blocage, etc.) */}
      <Button 
        variant={isBlocked ? "destructive" : "outline"} 
        onClick={() => handleToggleBlock(profileId)}
        disabled={isLoading}
        className="flex-none gap-1.5"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
        {isBlocked ? "Débloquer" : "Bloquer"}
      </Button>
    </div>
  );
}
