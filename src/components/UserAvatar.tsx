import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  user: UserProfile | null;
  className?: string;
}
export function UserAvatar({
  user,
  className
}: UserAvatarProps) {
  if (!user) {
    return <Avatar className={className}>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>;
  }
  return;
}