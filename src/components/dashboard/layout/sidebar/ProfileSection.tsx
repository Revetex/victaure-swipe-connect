
import { Profile } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";

interface ProfileSectionProps {
  profile: UserProfile;
  showProfilePreview: boolean;
  onProfileClick: () => void;
  onClosePreview: () => void;
}

export function ProfileSection({ profile, showProfilePreview, onProfileClick, onClosePreview }: ProfileSectionProps) {
  return (
    <>
      {profile && (
        <Profile
          profile={profile}
          isOpen={showProfilePreview}
          onClose={onClosePreview}
        />
      )}
    </>
  );
}
