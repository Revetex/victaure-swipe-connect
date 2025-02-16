
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  className?: string;
}

export function UserAvatar({ imageUrl, name, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("relative w-8 h-8", className)}>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name || 'Avatar'} />
      ) : (
        <AvatarFallback>
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
