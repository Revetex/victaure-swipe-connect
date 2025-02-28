
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { UserProfile } from "@/types/profile";
import { X, ChevronRight, Mail, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProfilePreviewFront } from "./ProfilePreviewFront";
import { ProfilePreviewBack } from "./ProfilePreviewBack";

interface ProfilePreviewDialogProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestChat?: () => void;
  canViewFullProfile: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewDialog({
  profile,
  isOpen,
  onClose,
  onRequestChat,
  canViewFullProfile,
  onImageClick,
}: ProfilePreviewDialogProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  if (!isOpen) return null;

  return (
    <div className="overflow-hidden h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-3">
          <UserAvatar
            user={{
              id: profile.id,
              name: profile.full_name || "",
              image: profile.avatar_url,
            }}
            className="h-9 w-9"
            fallbackClassName="bg-primary/10 text-primary"
          />

          <div>
            <h2 className="text-base font-medium leading-none">
              {profile.full_name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {canViewFullProfile
                ? "Voir le profil complet"
                : "Profil limité"}
            </p>
          </div>
        </div>

        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleFlip}
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Retourner</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500 ease-in-out",
            flipped ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <ProfilePreviewFront
            profile={profile}
            onRequestChat={onRequestChat}
            onFlip={handleFlip}
            canViewFullProfile={canViewFullProfile}
            hideCloseButton
            isDialog
          />
        </div>

        <div
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500 ease-in-out",
            flipped ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <ProfilePreviewBack
            profile={profile}
            onFlip={handleFlip}
            canViewFullProfile={canViewFullProfile}
          />
        </div>
      </div>
    </div>
  );
}
