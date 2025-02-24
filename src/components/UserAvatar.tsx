
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
      <Avatar className={cn("border-2 border-border shadow-md", className)}>
        <AvatarFallback className="bg-card">
          <User className="h-4 w-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("border-2 border-border shadow-md", className)}>
      {user.avatar_url ? (
        <AvatarImage 
          src={user.avatar_url} 
          alt={user.full_name || "Avatar"}
          className="object-cover"
        />
      ) : (
        <AvatarFallback className="bg-card">
          {user.full_name ? (
            <span className="font-medium text-muted-foreground">
              {user.full_name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
