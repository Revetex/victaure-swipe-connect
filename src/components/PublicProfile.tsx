
import { UserProfile, Experience } from "@/types/profile";
import { VCardAvatar } from "./vcard/header/VCardAvatar";
import { VCardExperiences } from "./vcard/VCardExperiences";
import { transformExperience } from "@/types/profile";

interface PublicProfileProps {
  profile: UserProfile;
}

export function PublicProfile({ profile }: PublicProfileProps) {
  // Assurons-nous que les expériences ont le bon format
  const formattedExperiences = profile.experiences.map(exp => transformExperience({
    ...exp,
    profile_id: profile.id
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <VCardAvatar profile={profile} isEditing={false} setProfile={() => {}} />
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

      {formattedExperiences.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Expérience</h3>
          <VCardExperiences 
            experiences={formattedExperiences}
            isEditing={false}
          />
        </div>
      )}
    </div>
  );
}
