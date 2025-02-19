
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: UserProfile | null;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) {
    return (
      <Avatar className={className}>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("bg-background relative overflow-hidden", className)}>
      {user.avatar_url ? (
        <>
          <AvatarImage 
            src={user.avatar_url} 
            alt={user.full_name || 'Avatar'} 
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/user-icon.svg';
            }}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
        </>
      ) : (
        <AvatarFallback className="bg-primary/5">
          {user.full_name ? user.full_name[0].toUpperCase() : <User className="h-4 w-4" />}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
