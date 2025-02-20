
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";

interface SearchResultsProps {
  results: UserProfile[];
  onSelect?: (profile: UserProfile) => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <Card className="w-full shadow-lg border-primary/10 bg-card/95 backdrop-blur">
      <div className="py-1">
        {results.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelect?.(profile)}
            className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
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
