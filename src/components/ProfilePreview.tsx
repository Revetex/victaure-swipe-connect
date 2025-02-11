
import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useConnectionActions } from "./profile/preview/hooks/useConnectionActions";
import { UserPlus, UserMinus, Ban, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

const MemoizedProfilePreviewDialog = memo(ProfilePreviewDialog);

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

  const handleRequestChat = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/dashboard/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  const handleActionWithToast = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const renderConnectionButtons = () => {
    if (isOwnProfile) return null;

    return (
      <div className="flex flex-col gap-2 mt-4">
        {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
          <Button 
            onClick={() => handleActionWithToast(handleAddFriend, "Demande d'ami envoyée")}
            variant="default" 
            className="w-full flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter en ami
          </Button>
        )}

        {isFriendRequestReceived && (
          <Button
            onClick={() => handleActionWithToast(handleAcceptFriend, "Demande d'ami acceptée")}
            variant="default"
            className="w-full flex items-center gap-2"
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
            className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <UserMinus className="h-4 w-4" />
            {isFriend ? "Retirer des amis" : "Annuler la demande"}
          </Button>
        )}

        <Button
          onClick={() => handleActionWithToast(handleToggleBlock, 
            isBlocked ? "Utilisateur débloqué" : "Utilisateur bloqué")}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Ban className="h-4 w-4" />
          {isBlocked ? "Débloquer" : "Bloquer"}
        </Button>

        {isFriend && (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleRequestChat}
          >
            <MessageCircle className="h-4 w-4" />
            Envoyer un message
          </Button>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-full p-0">
          <MemoizedProfilePreviewDialog
            profile={profile}
            isOpen={isOpen}
            onClose={onClose}
            onRequestChat={handleRequestChat}
          />
          {renderConnectionButtons()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
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
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(4px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-background/80"
            onClick={onClose}
          />
          
          <motion.div 
            className="relative z-10 w-full max-w-lg mx-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <MemoizedProfilePreviewDialog
                profile={profile}
                isOpen={isOpen}
                onClose={onClose}
                onRequestChat={handleRequestChat}
              />
              {renderConnectionButtons()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
