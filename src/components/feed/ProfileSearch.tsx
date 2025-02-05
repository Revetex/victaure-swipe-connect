import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Search...", className }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (debouncedSearch) {
        query.ilike("full_name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return data as UserProfile[];
    },
    enabled: Boolean(debouncedSearch),
  });

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
    onSelect(profile);
  };

  const handleProfilePreviewClose = () => {
    setSelectedProfile(null);
    setSearch("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Command className="rounded-lg border shadow-md bg-background">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList>
          {debouncedSearch && (
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
                  onSelect={() => handleProfileClick(profile)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
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
          )}
        </CommandList>
      </Command>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={handleProfilePreviewClose}
          isOpen={!!selectedProfile}
        />
      )}
    </div>
  );
}