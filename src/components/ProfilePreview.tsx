import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewHeader } from "./profile/preview/ProfilePreviewHeader";
import { ProfilePreviewBio } from "./profile/preview/ProfilePreviewBio";
import { ProfilePreviewSkills } from "./profile/preview/ProfilePreviewSkills";
import { ProfilePreviewContact } from "./profile/preview/ProfilePreviewContact";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px] gap-4 overflow-y-auto max-h-[90vh]"
        style={{ position: 'relative', zIndex: 101 }}
      >
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        
        <ProfilePreviewHeader 
          profile={profile}
          onRequestChat={onRequestChat}
        />
        
        <ProfilePreviewBio profile={profile} />
        <ProfilePreviewSkills profile={profile} />
        <ProfilePreviewContact profile={profile} />
      </DialogContent>
    </Dialog>
  );
}