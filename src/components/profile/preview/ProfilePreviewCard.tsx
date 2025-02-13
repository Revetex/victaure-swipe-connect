
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/profile";
import { UserRound } from "lucide-react";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose: () => void;
  canViewFullProfile: boolean;
  onImageClick?: () => void;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onClose,
  canViewFullProfile,
  onImageClick,
}: ProfilePreviewCardProps) {
  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <Avatar 
          className="h-24 w-24 cursor-pointer"
          onClick={onImageClick}
        >
          <AvatarImage src={profile.avatar_url || ""} />
          <AvatarFallback>
            <UserRound className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{profile.full_name}</h3>
          {canViewFullProfile && (
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
