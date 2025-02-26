
import { UserProfile } from "@/types/profile";
import { ProfilePreviewCard } from "./ProfilePreviewCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile?: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile = false,
  onImageClick,
}: ProfilePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md p-6 overflow-hidden bg-background relative z-[100] rounded-lg"
      >
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <ProfilePreviewCard
          profile={profile}
          onRequestChat={onRequestChat}
          onClose={onClose}
          canViewFullProfile={canViewFullProfile}
          onImageClick={onImageClick}
        />
      </DialogContent>
    </Dialog>
  );
}
