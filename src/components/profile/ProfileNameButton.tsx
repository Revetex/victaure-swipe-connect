import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";

interface ProfileNameButtonProps {
  profile: UserProfile;
  className?: string;
}

export function ProfileNameButton({ profile, className }: ProfileNameButtonProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Button
        variant="link"
        className={className}
        onClick={() => setShowPreview(true)}
      >
        {profile.full_name || "Utilisateur"}
      </Button>

      <ProfilePreview
        profile={profile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
}