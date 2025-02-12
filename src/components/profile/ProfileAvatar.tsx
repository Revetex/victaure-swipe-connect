
import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface ProfileAvatarProps {
  profile: UserProfile;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <>
      <Avatar 
        className="h-24 w-24 ring-2 ring-primary/10 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => profile.avatar_url && setShowFullImage(true)}
      >
        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
        <AvatarFallback>
          <UserRound className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      {profile.avatar_url && (
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
            <img
              src={profile.avatar_url}
              alt={profile.full_name || ""}
              className="w-full h-full object-contain"
              onClick={() => setShowFullImage(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
