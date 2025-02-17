
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";

interface UserNavProps {
  profile: UserProfile | null;
}

export function UserNav({ profile }: UserNavProps) {
  if (!profile) return null;

  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <UserAvatar user={profile} />
    </Button>
  );
}
