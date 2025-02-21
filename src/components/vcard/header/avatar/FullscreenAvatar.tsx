
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserCircle } from "lucide-react";

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
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={fullName || 'Avatar'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/user-icon.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <UserCircle className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
