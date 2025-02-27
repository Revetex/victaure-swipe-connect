
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Ban, MessageCircle, Lock, User, ExternalLink } from "lucide-react";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { ProfilePreviewHeader } from "./ProfilePreviewHeader";
import { ProfilePreviewContact } from "./ProfilePreviewContact";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfilePreviewFrontProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onFlip: () => void;
  canViewFullProfile: boolean;
  onClose?: () => void;
  onViewProfile: () => void;
}

export function ProfilePreviewFront({
  profile,
  onRequestChat,
  onFlip,
  canViewFullProfile,
  onClose,
  onViewProfile
}: ProfilePreviewFrontProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = user?.id === profile.id;
  
  const {
    isFriend,
    isBlocked,
    isFriendRequestSent,
    isFriendRequestReceived,
  } = useConnectionStatus(profile.id);

  const {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
  } = useConnectionActions(profile.id);

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    
    if (onClose) onClose();
    navigate(`/messages?receiver=${profile.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-background/80 backdrop-blur-sm border-b border-border/10">
        <ProfilePreviewHeader profile={profile} />
        
        <div className="mt-6 grid gap-2">
          {isOwnProfile ? (
            <Button 
              onClick={onViewProfile}
              className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90"
            >
              <User className="mr-2 h-4 w-4" />
              Voir mon profil
            </Button>
          ) : (
            <>
              <Button 
                onClick={onViewProfile}
                variant={canViewFullProfile ? "default" : "secondary"}
                className={cn(
                  "w-full",
                  canViewFullProfile 
                    ? "bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90"
                    : "bg-muted/50 hover:bg-muted/70"
                )}
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

              {!isBlocked && (
                <Button
                  variant="outline"
                  className="w-full border-border/10 hover:bg-muted/5"
                  onClick={handleMessageClick}
                  disabled={!isFriend}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {isFriend ? "Envoyer un message" : "Connectez-vous d'abord"}
                </Button>
              )}

              {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
                <Button 
                  onClick={handleAddFriend}
                  className="w-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 hover:from-emerald-500 hover:to-emerald-600/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              )}

              {isFriendRequestReceived && (
                <Button
                  onClick={handleAcceptFriend}
                  className="w-full bg-gradient-to-r from-emerald-500/80 to-emerald-600 hover:from-emerald-500 hover:to-emerald-600/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Accepter la demande
                </Button>
              )}

              {(isFriend || isFriendRequestSent) && (
                <Button
                  onClick={handleRemoveFriend}
                  variant="outline"
                  className="w-full border-destructive/30 hover:bg-destructive/10 text-destructive"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  {isFriend ? "Retirer des amis" : "Annuler la demande"}
                </Button>
              )}

              <Button
                onClick={() => handleToggleBlock(profile.id)}
                variant="outline"
                className="w-full border-border/10 hover:bg-muted/5"
              >
                <Ban className="mr-2 h-4 w-4" />
                {isBlocked ? "Débloquer" : "Bloquer"}
              </Button>
            </>
          )}
        </div>
        
        {isFriend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-border/10"
          >
            <ProfilePreviewContact profile={profile} />
          </motion.div>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/5"
        onClick={onFlip}
      >
        Voir le dos de la carte
      </Button>
    </div>
  );
}
