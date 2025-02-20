
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

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card rounded-xl shadow-lg overflow-hidden"
      >        
        <div className="relative p-6">
          <ProfilePreviewHeader profile={profile} />
          
          <div className="mt-6 space-y-4">
            {isOwnProfile ? (
              <Button 
                onClick={onViewProfile}
                variant="default" 
                className="w-full flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Voir mon profil
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onViewProfile}
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

                {!isBlocked && (
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={onRequestChat}
                    disabled={!isFriend}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {isFriend ? "Envoyer un message" : "Connectez-vous d'abord"}
                  </Button>
                )}

                {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
                  <Button 
                    onClick={handleAddFriend}
                    variant="default" 
                    className="w-full flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Ajouter
                  </Button>
                )}

                {isFriendRequestReceived && (
                  <Button
                    onClick={handleAcceptFriend}
                    variant="default"
                    className="w-full flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Accepter la demande
                  </Button>
                )}

                {(isFriend || isFriendRequestSent) && (
                  <Button
                    onClick={handleRemoveFriend}
                    variant="outline"
                    className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <UserMinus className="h-4 w-4" />
                    {isFriend ? "Retirer des amis" : "Annuler la demande"}
                  </Button>
                )}

                <Button
                  onClick={handleToggleBlock}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Ban className="h-4 w-4" />
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
      </motion.div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={onFlip}
      >
        Voir le dos de la carte
      </Button>
    </div>
  );
}
