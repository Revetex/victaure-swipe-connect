
import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "./ui/button";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useConnectionActions } from "./profile/preview/hooks/useConnectionActions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Edit, UserPlus, UserMinus, UserX } from "lucide-react";
import { toast } from "sonner";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  const navigate = useNavigate();
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
    handleToggleBlock
  } = useConnectionActions(profile.id);

  const handleEditProfile = () => {
    navigate("/dashboard/profile/edit");
    onClose();
  };

  if (!profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Informations détaillées du profil de {profile.full_name || "l'utilisateur"}
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="p-4 bg-muted/30 border-b flex justify-end gap-2">
          {isOwnProfile ? (
            <Button
              onClick={handleEditProfile}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier mon profil
            </Button>
          ) : (
            <>
              {!isFriend && !isFriendRequestSent && !isFriendRequestReceived && !isBlocked && (
                <Button
                  onClick={handleAddFriend}
                  variant="outline"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter en ami
                </Button>
              )}

              {isFriendRequestReceived && (
                <Button
                  onClick={handleAcceptFriend}
                  variant="default"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Accepter la demande
                </Button>
              )}

              {(isFriend || isFriendRequestSent) && (
                <Button
                  onClick={handleRemoveFriend}
                  variant="outline"
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <UserMinus className="h-4 w-4" />
                  {isFriend ? "Retirer des amis" : "Annuler la demande"}
                </Button>
              )}

              <Button
                onClick={handleToggleBlock}
                variant="outline"
                className="gap-2"
              >
                <UserX className="h-4 w-4" />
                {isBlocked ? "Débloquer" : "Bloquer"}
              </Button>
            </>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <VCard profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
