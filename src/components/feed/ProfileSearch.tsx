
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
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
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className={cn("relative", className)} role="search">
      <Command className="rounded-lg border shadow-md" aria-label="Recherche de profils">
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={!isFocused}
          aria-label="Rechercher un utilisateur"
          className="-webkit-user-select: none; user-select: none;"
        />
        <CommandList>
          {debouncedSearch && (
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
                  key={`${profile.id}-${profile.full_name}`}
                  onSelect={() => handleProfileClick(profile)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    hoveredId === profile.id ? "bg-accent" : ""
                  )}
                  role="option"
                  aria-selected={hoveredId === profile.id}
                >
                  <span>{profile.full_name || profile.email}</span>
                  {profile.id === hoveredId && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      Cliquer pour sélectionner
                    </span>
                  )}
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
