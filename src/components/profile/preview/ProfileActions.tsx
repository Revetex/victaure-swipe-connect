
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  UserMinus, 
  UserX, 
  MessageCircle, 
  Lock,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFriend: boolean;
  isBlocked: boolean;
  isFriendRequestSent: boolean;
  isFriendRequestReceived: boolean;
  isPrivate: boolean;
  onViewProfile: () => void;
  onAddFriend: () => void;
  onAcceptFriend: () => void;
  onRemoveFriend: () => void;
  onToggleBlock: () => void;
  onMessage: () => void;
}

export function ProfileActions({
  isOwnProfile,
  isFriend,
  isBlocked,
  isFriendRequestSent,
  isFriendRequestReceived,
  isPrivate,
  onViewProfile,
  onAddFriend,
  onAcceptFriend,
  onRemoveFriend,
  onToggleBlock,
  onMessage,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={onViewProfile}
        variant={isPrivate && !isFriend && !isOwnProfile ? "secondary" : "default"}
        className="w-full flex items-center justify-center gap-2"
      >
        {isPrivate && !isFriend && !isOwnProfile ? (
          <>
            <Lock className="h-4 w-4" />
            Profil privé
          </>
        ) : (
          'Voir le profil complet'
        )}
      </Button>

      {!isOwnProfile && (
        <>
          {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
            <Button
              onClick={onAddFriend}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter en ami
            </Button>
          )}

          {isFriendRequestReceived && (
            <Button
              onClick={onAcceptFriend}
              variant="default"
              className="w-full flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Accepter la demande
            </Button>
          )}

          {isFriend && (
            <>
              <Button
                onClick={onMessage}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </Button>
              <Button
                onClick={onRemoveFriend}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <UserMinus className="h-4 w-4" />
                Retirer des amis
              </Button>
            </>
          )}

          {isFriendRequestSent && (
            <Button
              onClick={onRemoveFriend}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <UserMinus className="h-4 w-4" />
              Annuler la demande
            </Button>
          )}

          <Button
            onClick={onToggleBlock}
            variant={isBlocked ? "destructive" : "outline"}
            className={cn(
              "w-full flex items-center justify-center gap-2",
              !isBlocked && "text-destructive hover:text-destructive"
            )}
          >
            <UserX className="h-4 w-4" />
            {isBlocked ? "Débloquer" : "Bloquer"}
          </Button>
        </>
      )}
    </div>
  );
}
