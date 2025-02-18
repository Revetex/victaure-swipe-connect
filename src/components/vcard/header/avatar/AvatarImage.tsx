
import { Avatar, AvatarImage as UIAvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarImageProps {
  url: string | null;
  fullName: string | null;
  onError: () => void;
  hasError: boolean;
  isLoading: boolean;
  className?: string;
}

export function AvatarImage({ url, fullName, onError, hasError, isLoading, className }: AvatarImageProps) {
  return (
    <Avatar className={cn("h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/20 shadow-lg", className)}>
      {!hasError && url ? (
        <UIAvatarImage 
          src={url} 
          alt={fullName || ''}
          className="object-contain w-full h-full"
          onError={onError}
        />
      ) : (
        <AvatarFallback className="bg-primary/10">
          <UserCircle2 className="h-12 w-12 text-primary/60" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
