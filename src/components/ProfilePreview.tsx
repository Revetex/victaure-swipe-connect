
import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePreviewModal } from "./profile/preview/ProfilePreviewModal";
import { ProfilePreviewButtons } from "./profile/preview/ProfilePreviewButtons";

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

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-full p-0">
          <div className="flex flex-col h-full">
            <MemoizedProfilePreviewDialog
              profile={profile}
              isOpen={isOpen}
              onClose={onClose}
              onRequestChat={onRequestChat}
              canViewFullProfile={canViewFullProfile}
            />
            <ProfilePreviewButtons
              profile={profile}
              onRequestChat={onRequestChat}
              onClose={onClose}
              canViewFullProfile={canViewFullProfile}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ProfilePreviewModal
          profile={profile}
          isOpen={isOpen}
          onClose={onClose}
          onRequestChat={onRequestChat}
          canViewFullProfile={canViewFullProfile}
        />
      )}
    </AnimatePresence>
  );
}
