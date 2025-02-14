
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
import { useReceiver } from "@/hooks/useReceiver";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const MemoizedProfilePreviewDialog = memo(ProfilePreviewDialog);

export function ProfilePreview({
  profile,
  isOpen,
  onClose,
}: ProfilePreviewProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  const { setReceiver } = useReceiver();
  const isOwnProfile = user?.id === profile.id;
  const canViewFullProfile = isOwnProfile || !profile.privacy_enabled;
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  const handleImageClick = () => {
    if (profile.avatar_url) {
      setShowFullscreenImage(true);
    }
  };

  const handleRequestChat = () => {
    setReceiver({
      id: profile.id,
      full_name: profile.full_name || "Utilisateur",
      avatar_url: profile.avatar_url || "",
      online_status: profile.online_status || false,
      last_seen: profile.last_seen || new Date().toISOString()
    });
    onClose();
    navigate("/dashboard/messages");
  };

  if (isMobile) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md w-full p-0">
            <div className="flex flex-col h-full">
              <MemoizedProfilePreviewDialog
                profile={profile}
                isOpen={isOpen}
                onClose={onClose}
                onRequestChat={handleRequestChat}
                canViewFullProfile={canViewFullProfile}
                onImageClick={handleImageClick}
              />
              <ProfilePreviewButtons
                profile={profile}
                onRequestChat={handleRequestChat}
                onClose={onClose}
                canViewFullProfile={canViewFullProfile}
              />
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
          onRequestChat={handleRequestChat}
          canViewFullProfile={canViewFullProfile}
          onImageClick={handleImageClick}
        />
      )}

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
    </AnimatePresence>
  );
}
