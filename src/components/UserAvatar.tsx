
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

export function UserAvatar({ src, fallback, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
