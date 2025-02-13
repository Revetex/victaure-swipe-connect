import { VCard } from "@/components/VCard";
import { UserProfile } from "@/types/profile";

interface PublicProfileContentProps {
  profile: UserProfile;
}

export function PublicProfileContent({ profile }: PublicProfileContentProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <VCard profile={profile} isPublic />
    </div>
  );
}