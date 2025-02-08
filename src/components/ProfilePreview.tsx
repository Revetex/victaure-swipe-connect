import { UserProfile } from "@/types/profile";
import { ProfilePreviewDialog } from "./profile/preview/ProfilePreviewDialog";
import { useNavigate } from "react-router-dom";

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

  const handleRequestChat = () => {
    if (onRequestChat) {
      onRequestChat();
    } else {
      navigate(`/dashboard/messages?receiver=${profile.id}`);
    }
    onClose();
  };

  return (
    <ProfilePreviewDialog
      profile={profile}
      isOpen={isOpen}
      onClose={onClose}
      onRequestChat={handleRequestChat}
    />
  );
}