
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-primary/10">
        <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
        <AvatarFallback>
          {profile.full_name?.charAt(0).toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">{profile.full_name}</h2>
        <p className="text-sm text-muted-foreground truncate">{profile.role}</p>
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}
