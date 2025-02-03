import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/profile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileActions } from "@/components/profile/ProfileActions";

interface ProfilePreviewProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePreview({ profile, isOpen, onClose }: ProfilePreviewProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    onClose();
    navigate(`/dashboard/public-profile/${profile.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-4">
        <DialogTitle className="sr-only">Profile Preview</DialogTitle>
        <div className="flex flex-col items-center gap-4">
          <ProfileAvatar profile={profile} />
          <ProfileInfo profile={profile} />
          
          <div className="w-full space-y-4">
            <div className="text-sm text-muted-foreground">
              {profile.bio || "No bio available"}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleViewProfile}
              className="flex-1"
              variant="default"
            >
              View Profile
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}