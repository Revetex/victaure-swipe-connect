
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserProfile } from "@/types/profile";

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
    setSearch(""); // Clear search after selection
  };

  const handleProfilePreviewClose = () => {
    setSelectedProfile(null);
  };

  return (
    <div className={`relative ${className}`}>
      <Command className="rounded-lg border shadow-md bg-background">
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <CommandList>
          {debouncedSearch && (
            <CommandGroup>
              {isLoading && (
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche en cours...
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
                  className={`cursor-pointer ${
                    hoveredId === profile.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {profile.avatar_url && (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || ""} 
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{profile.full_name || profile.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>

      {selectedProfile && (
        <div className="fixed inset-0 z-50">
          <ProfilePreview 
            profile={selectedProfile} 
            onClose={handleProfilePreviewClose}
            isOpen={!!selectedProfile}
          />
        </div>
      )}
    </div>
  );
}
