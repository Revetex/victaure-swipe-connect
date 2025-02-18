
import { UserProfile } from "@/types/profile";
import { VCardAvatar } from "./vcard/header/VCardAvatar";
import { VCardExperiences } from "./vcard/VCardExperiences";
import { useState } from "react";

interface PublicProfileProps {
  profile: UserProfile;
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <VCardAvatar 
          profile={profile} 
          isEditing={false} 
          setProfile={() => {}} 
          setIsAvatarDeleted={setIsAvatarDeleted}
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.full_name}</h2>
          <p className="text-muted-foreground">{profile.role}</p>
        </div>
      </div>

      {profile.bio && (
        <div>
          <h3 className="text-lg font-medium mb-2">Bio</h3>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>
      )}

      {profile.experiences.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Expérience</h3>
          <VCardExperiences 
            experiences={profile.experiences}
            isEditing={false}
            onUpdate={() => {}}
          />
        </div>
      )}
    </div>
  );
}
