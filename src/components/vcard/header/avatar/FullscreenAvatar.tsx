
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserCircle, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

interface FullscreenAvatarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  fullName: string | null;
}

export function FullscreenAvatar({ isOpen, onOpenChange, imageUrl, fullName }: FullscreenAvatarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 p-0 max-w-none max-h-none h-screen w-screen bg-black/95 border-none z-50">
        <VisuallyHidden asChild>
          <DialogTitle>Photo de profil de {fullName || "l'utilisateur"}</DialogTitle>
        </VisuallyHidden>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={fullName || 'Avatar'}
              className="max-w-[90%] max-h-[90vh] object-contain"
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
