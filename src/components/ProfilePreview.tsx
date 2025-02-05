import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";

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
  return (
    <ProfilePreviewDialog
      profile={profile}
      isOpen={isOpen}
      onClose={onClose}
      onRequestChat={onRequestChat}
    />
  );
}