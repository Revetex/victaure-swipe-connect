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
export function FullscreenAvatar({
  isOpen,
  onOpenChange,
  imageUrl,
  fullName
}: FullscreenAvatarProps) {
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      
    </Dialog>;
}