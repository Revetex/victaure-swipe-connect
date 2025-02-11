
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Rechercher un utilisateur...", className }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];

      const query = supabase
        .from("profiles")
        .select("*")
        .order("full_name")
        .ilike("full_name", `%${debouncedSearch}%`)
        .limit(10);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return data as UserProfile[];
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 30000,
    gcTime: 60000
  });

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
    onSelect(profile);
    setSearch("");
  };

  const handleProfilePreviewClose = () => {
    setSelectedProfile(null);
    setSearch("");
  };

  return (
    <div className={cn(
      "relative", 
      "transition-all duration-200",
      className
    )} role="search">
      <Command className="rounded-lg border shadow-md bg-background/95 backdrop-blur-sm" aria-label="Recherche de profils">
        <div className="flex items-center px-3">
          <Search className="w-4 h-4 text-muted-foreground/70" />
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="focus:ring-0 border-none"
          />
        </div>
        {debouncedSearch.length >= 2 && (
          <CommandList>
            <CommandGroup heading="Résultats de recherche">
              {isLoading && (
                <CommandItem disabled aria-label="Chargement en cours">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Recherche en cours...</span>
                </CommandItem>
              )}
              
              {!isLoading && profiles.length === 0 && (
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              )}

              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  onSelect={() => handleProfileClick(profile)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    "flex items-center gap-3 py-2",
                    hoveredId === profile.id ? "bg-accent" : ""
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || ""}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {(profile.full_name?.[0] || profile.email[0]).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{profile.full_name || profile.email}</span>
                    {profile.full_name && (
                      <span className="text-xs text-muted-foreground">{profile.email}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
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
