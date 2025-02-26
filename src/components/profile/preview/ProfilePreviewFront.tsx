
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
      <div className="p-6 backdrop-blur-sm">
        <ProfilePreviewHeader profile={profile} />
        
        <div className="mt-6 grid gap-2">
          {isOwnProfile ? (
            <Button 
              onClick={onViewProfile}
              variant="default" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    : "bg-gray-700/50 hover:bg-gray-700/70"
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
                  className="w-full border-white/10 hover:bg-white/5"
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
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              )}

              {isFriendRequestReceived && (
                <Button
                  onClick={handleAcceptFriend}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Accepter la demande
                </Button>
              )}

              {(isFriend || isFriendRequestSent) && (
                <Button
                  onClick={handleRemoveFriend}
                  variant="outline"
                  className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400"
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  {isFriend ? "Retirer des amis" : "Annuler la demande"}
                </Button>
              )}

              <Button
                onClick={handleToggleBlock}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
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
            className="mt-6 pt-6 border-t border-white/10"
          >
            <ProfilePreviewContact profile={profile} />
          </motion.div>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full text-white/70 hover:text-white hover:bg-white/5"
        onClick={onFlip}
      >
        Voir le dos de la carte
      </Button>
    </div>
  );
}
