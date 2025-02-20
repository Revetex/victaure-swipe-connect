
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FullscreenAvatarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  fullName: string | null;
}

export function FullscreenAvatar({ isOpen, onOpenChange, imageUrl, fullName }: FullscreenAvatarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0">
        <div className="relative w-full h-full max-h-[80vh] overflow-hidden">
          <img
            src={imageUrl || ''}
            alt={fullName || ''}
            className="w-full h-full object-contain"
            onClick={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
