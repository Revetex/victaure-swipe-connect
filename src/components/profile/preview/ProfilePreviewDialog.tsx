import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewCard } from "./ProfilePreviewCard";

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
      <DialogContent className="max-w-xl p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ProfilePreviewCard 
          profile={profile}
          onRequestChat={onRequestChat}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}