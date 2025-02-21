
import { Avatar, AvatarImage as UIAvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, ImageOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AvatarImageProps {
  url: string | null;
  fullName: string | null;
  onError: () => void;
  hasError: boolean;
  isLoading: boolean;
  className?: string;
}

export function AvatarImage({ url, fullName, onError, hasError, isLoading, className }: AvatarImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Erreur de chargement de l'image:", e);
    onError();
    toast.error("Impossible de charger l'image", {
      id: "avatar-load-error",
    });
  };

  const avatarClasses = cn(
    "h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/20 shadow-lg",
    "relative overflow-hidden bg-background",
    className
  );

  if (isLoading) {
    return (
      <Avatar className={avatarClasses}>
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Avatar>
    );
  }

  if (hasError) {
    return (
      <Avatar className={avatarClasses}>
        <AvatarFallback className="bg-destructive/10">
          <ImageOff className="h-8 w-8 text-destructive/60" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (!url) {
    return (
      <Avatar className={avatarClasses}>
        <AvatarFallback className="bg-primary/10">
          <UserCircle2 className="h-12 w-12 text-primary/60" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={avatarClasses}>
      <UIAvatarImage 
        src={url}
        alt={fullName || ''}
        className="object-cover w-full h-full"
        onError={handleImageError}
      />
    </Avatar>
  );
}
