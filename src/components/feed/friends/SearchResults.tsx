import { UserProfile } from "@/types/profile";
import { CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Loader2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  isLoading: boolean;
  profiles: UserProfile[];
  debouncedSearch: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (profile: UserProfile) => void;
}

export function SearchResults({
  isLoading,
  profiles,
  debouncedSearch,
  hoveredId,
  onHover,
  onSelect,
}: SearchResultsProps) {
  if (!debouncedSearch) return null;

  return (
    <CommandGroup heading="Résultats de la recherche">
      {isLoading && (
        <CommandItem disabled className="py-6 text-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Recherche en cours...</span>
        </CommandItem>
      )}
      
      {!isLoading && profiles.length === 0 && (
        <CommandEmpty className="py-6 text-center">
          <p className="text-sm text-muted-foreground">Aucun résultat trouvé.</p>
          <p className="text-xs text-muted-foreground mt-1">Essayez avec un autre terme de recherche.</p>
        </CommandEmpty>
      )}

      {profiles.map((profile) => (
        <CommandItem
          key={profile.id}
          onSelect={() => onSelect(profile)}
          onMouseEnter={() => onHover(profile.id)}
          onMouseLeave={() => onHover(null)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
            hoveredId === profile.id ? "bg-accent" : ""
          )}
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserPlus className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {profile.full_name || profile.email}
            </p>
            {profile.email && (
              <p className="text-xs text-muted-foreground truncate">
                {profile.email}
              </p>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}