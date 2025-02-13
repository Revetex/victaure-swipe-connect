
import { ProfilePreview } from "@/components/ProfilePreview";
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
        <ProfilePreview
          profile={profile}
          isOpen={showProfilePreview}
          onClose={onClosePreview}
        />
      )}
    </>
  );
}
