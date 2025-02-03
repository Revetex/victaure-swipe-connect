import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { CategorizedSkills } from "@/components/skills/CategorizedSkills";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePreview({ profile, isOpen, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();
  const [isEditing] = useState(false);

  const handleRemoveSkill = () => {
    // Placeholder for skill removal functionality
  };

  const handleViewProfile = () => {
    onClose();
    navigate(`/profile/${profile.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-4">
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        <div className="flex flex-col items-center gap-4">
          <ProfileAvatar profile={profile} />
          <ProfileInfo profile={profile} />
          <ProfileBio bio={profile.bio} />
          
          <div className="w-full">
            <CategorizedSkills
              profile={profile}
              isEditing={isEditing}
              onRemoveSkill={handleRemoveSkill}
            />
          </div>

          <div className="flex justify-end w-full">
            <Button 
              onClick={handleViewProfile}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              Voir le profil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}