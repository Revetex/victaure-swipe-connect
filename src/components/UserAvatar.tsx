
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { User } from "lucide-react";

interface UserAvatarProps {
  user: UserProfile;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ''} />
      <AvatarFallback>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
