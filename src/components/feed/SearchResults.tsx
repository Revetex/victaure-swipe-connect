
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";

interface SearchResultsProps {
  results: UserProfile[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <Card className="absolute w-full z-10 mt-1 p-2 space-y-2">
      {results.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
        >
          <UserAvatar user={profile} className="h-8 w-8" />
          <div>
            <p className="text-sm font-medium">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
