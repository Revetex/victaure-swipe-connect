import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface ProfileAvatarProps {
  profile: UserProfile;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  return (
    <Avatar className="h-24 w-24 ring-2 ring-primary/10">
      <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
      <AvatarFallback>
        <UserRound className="h-12 w-12 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
}