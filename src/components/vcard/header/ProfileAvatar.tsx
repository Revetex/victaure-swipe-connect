import { UserProfile } from "@/types/profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface ProfileAvatarProps {
  profile: UserProfile;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  return (
    <Avatar className="w-24 h-24 rounded-full ring-2 ring-primary/20 shadow-md">
      <AvatarImage 
        src={profile.avatar_url || '/default-avatar.png'} 
        alt={profile.full_name || 'Profile'} 
        className="object-cover"
      />
      <AvatarFallback>
        <UserRound className="w-12 h-12 text-muted-foreground/50" />
      </AvatarFallback>
    </Avatar>
  );
}