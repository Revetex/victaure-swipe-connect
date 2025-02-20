
import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreviewModal } from "./profile/preview/ProfilePreviewModal";
import { ProfilePreviewButtons } from "./profile/preview/ProfilePreviewButtons";
import { toast } from "sonner";

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
  const canViewFullProfile = isOwnProfile || !profile.privacy_enabled;
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  const handleImageClick = () => {
    if (profile.avatar_url) {
      setShowFullscreenImage(true);
    }
  };

  const handleMessageClick = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  const handleViewFullProfile = () => {
    if (!canViewFullProfile) {
      toast.error("Ce profil est privé");
      return;
    }
    navigate(`/profile/${profile.id}`);
    onClose();
  };

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md w-full p-0">
            <div className="flex flex-col h-full overflow-hidden">
              <MemoizedProfilePreviewDialog
                profile={profile}
                isOpen={isOpen}
                onClose={onClose}
                onRequestChat={handleMessageClick}
                canViewFullProfile={canViewFullProfile}
                onImageClick={handleImageClick}
              />
              <div className="p-4 border-t bg-card/95 backdrop-blur-sm">
                <ProfilePreviewButtons
                  profile={profile}
                  onRequestChat={handleMessageClick}
                  onClose={onClose}
                  canViewFullProfile={canViewFullProfile}
                  onViewProfile={handleViewFullProfile}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showFullscreenImage} onOpenChange={setShowFullscreenImage}>
          <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/90">
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={profile.avatar_url || ""} 
                alt={profile.full_name || ""}
                className="max-w-full max-h-full object-contain"
                onClick={() => setShowFullscreenImage(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ProfilePreviewModal
          profile={profile}
          isOpen={isOpen}
          onClose={onClose}
          onRequestChat={handleMessageClick}
          canViewFullProfile={canViewFullProfile}
          onImageClick={handleImageClick}
          onViewProfile={handleViewFullProfile}
        />
      )}

      <Dialog open={showFullscreenImage} onOpenChange={setShowFullscreenImage}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.img 
              src={profile.avatar_url || ""} 
              alt={profile.full_name || ""}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={() => setShowFullscreenImage(false)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
