
import { VCard } from "@/components/VCard";
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";

interface PublicProfileContentProps {
  profile: UserProfile;
}

export function PublicProfileContent({ profile }: PublicProfileContentProps) {
  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg bg-[#F6F6F7] dark:bg-[#1A1F2C]">
      <VCard profile={profile} isPublic />
    </Card>
  );
}
