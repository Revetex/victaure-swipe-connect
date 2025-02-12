import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  UserPlus,
  UserMinus,
  UserX,
  MessageCircle,
  Lock,
  Heart
} from "lucide-react";
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
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
          <AvatarFallback>
            {profile.full_name?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{profile.full_name}</h2>
          <p className="text-sm text-muted-foreground truncate">{profile.role}</p>
          {profile.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleViewProfile}
          variant={profile.privacy_enabled && !isFriend && !isOwnProfile ? "secondary" : "default"}
          className="w-full flex items-center justify-center gap-2"
        >
          {profile.privacy_enabled && !isFriend && !isOwnProfile ? (
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
                onClick={handleAddFriend}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Ajouter en ami
              </Button>
            )}

            {isFriendRequestReceived && (
              <Button
                onClick={handleAcceptFriend}
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
                  onClick={handleMessageClick}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Envoyer un message
                </Button>
                <Button
                  onClick={handleRemoveFriend}
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
                onClick={handleRemoveFriend}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <UserMinus className="h-4 w-4" />
                Annuler la demande
              </Button>
            )}

            <Button
              onClick={handleToggleBlock}
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
