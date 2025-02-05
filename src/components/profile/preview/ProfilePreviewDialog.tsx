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
      <DialogContent 
        className="sm:max-w-[425px] gap-4 overflow-y-auto max-h-[90vh] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ 
          position: 'fixed',
          zIndex: 9999,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          perspective: '1000px'
        }}
      >
        <ProfilePreviewCard 
          profile={profile}
          onRequestChat={onRequestChat}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}