import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProfilePreviewCard } from "./ProfilePreviewCard";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
}: ProfilePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden bg-transparent border-none relative z-[100]"
        style={{ 
          position: 'fixed',
          zIndex: 100 
        }}
      >
        <VisuallyHidden asChild>
          <DialogTitle>Profil de {profile.full_name || "Utilisateur"}</DialogTitle>
        </VisuallyHidden>
        <ProfilePreviewCard
          profile={profile}
          onRequestChat={onRequestChat}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}