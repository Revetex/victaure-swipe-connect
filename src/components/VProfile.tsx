
import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useConnectionStatus } from "./profile/preview/hooks/useConnectionStatus";
import { useConnectionActions } from "./profile/preview/hooks/useConnectionActions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreviewButtons } from "./profile/preview/ProfilePreviewButtons";
import { ScrollArea } from "./ui/scroll-area";

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
    handleToggleBlock,
    handleRequestCV
  } = useConnectionActions(profile.id);

  const handleEditProfile = () => {
    navigate("/dashboard/profile/edit");
    onClose();
  };

  // Détermine si l'utilisateur peut voir le profil complet
  const canViewFullProfile = isOwnProfile || isFriend || !profile.privacy_enabled;

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
        
        <div className="sticky top-0 z-10 p-4 bg-background/95 backdrop-blur border-b">
          <ProfilePreviewButtons 
            profile={profile}
            onClose={onClose}
            canViewFullProfile={canViewFullProfile}
            onRequestChat={() => navigate(`/messages?receiver=${profile.id}`)}
            onViewProfile={() => {
              if (isOwnProfile) {
                handleEditProfile();
              } else {
                navigate(`/profile/${profile.id}`);
              }
            }}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
