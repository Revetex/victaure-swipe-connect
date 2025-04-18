
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";

interface SearchResultsProps {
  results: UserProfile[];
  onSelect?: (profile: UserProfile) => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <Card className="w-full absolute top-full mt-1 shadow-lg border-primary/10 bg-popover z-50">
      <div className="py-1 max-h-[300px] overflow-y-auto">
        {results.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelect?.(profile)}
            className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
          >
            <UserAvatar user={profile} className="h-8 w-8" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.full_name}</p>
              {profile.role && (
                <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
