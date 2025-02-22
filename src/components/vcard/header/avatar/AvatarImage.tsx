
import { Avatar, AvatarImage as UIAvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2, ImageOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface AvatarImageProps {
  url: string | null;
  fullName: string | null;
  onError: () => void;
  hasError: boolean;
  isLoading: boolean;
  className?: string;
}

export function AvatarImage({ url, fullName, onError, hasError, isLoading, className }: AvatarImageProps) {
  const isMobile = useIsMobile();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Erreur de chargement de l'image:", e);
    onError();
    toast.error("L'image de profil n'est pas accessible", {
      description: "Veuillez télécharger une nouvelle image",
      id: "avatar-load-error",
    });
  };

  const avatarClasses = cn(
    isMobile ? "h-32 w-32" : "h-24 w-24 sm:h-28 sm:w-28",
    "ring-2 ring-primary/20 shadow-lg",
    "relative overflow-hidden bg-background backdrop-blur-sm",
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
          <UserCircle2 className={cn(
            "text-primary/60",
            isMobile ? "h-16 w-16" : "h-12 w-12"
          )} />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={avatarClasses}>
      <UIAvatarImage 
        src={url}
        alt={fullName || 'Photo de profil'}
        className="object-cover w-full h-full"
        onError={handleImageError}
      />
      <AvatarFallback className="bg-primary/10">
        <UserCircle2 className={cn(
          "text-primary/60",
          isMobile ? "h-16 w-16" : "h-12 w-12"
        )} />
      </AvatarFallback>
    </Avatar>
  );
}
