import { UserProfile } from "@/types/profile";
import { VCard } from "./VCard";
import { Dialog, DialogContent } from "./ui/dialog";

interface VProfileProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function VProfile({ profile, isOpen, onClose }: VProfileProps) {
  if (!profile || profile.privacy_enabled) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <VCard />
      </DialogContent>
    </Dialog>
  );
}