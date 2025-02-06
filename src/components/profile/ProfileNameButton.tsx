
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";

interface ProfileNameButtonProps {
  profile: Partial<UserProfile> & { 
    id: string; 
    full_name: string | null;
    display_name?: string | null; 
  };
  className?: string;
}

export function ProfileNameButton({ profile, className }: ProfileNameButtonProps) {
  const [showPreview, setShowPreview] = useState(false);

  const displayName = profile.display_name || profile.full_name || "Utilisateur";

  return (
    <div className="inline-block">
      <span 
        onClick={() => setShowPreview(true)}
        className={`cursor-pointer hover:underline ${className}`}
      >
        {displayName}
      </span>

      {showPreview && (
        <ProfilePreview
          profile={profile as UserProfile}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
