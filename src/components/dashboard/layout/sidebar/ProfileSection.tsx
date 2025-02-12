
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
      <div className="p-2 border-b">
        <button
          onClick={onProfileClick}
          className="w-full bg-accent/50 hover:bg-accent transition-colors rounded-md p-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || ""}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {profile.full_name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">
                {profile.full_name || "Utilisateur"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile.role}
              </p>
            </div>
          </div>
        </button>
      </div>

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
