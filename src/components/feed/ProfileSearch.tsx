import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileSearch() {
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      if (!search) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${search}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      return (data || []) as UserProfile[];
    },
    enabled: search.length > 0,
    initialData: [],
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSearch("");
    setIsInputFocused(false);
  };

  const shouldShowResults = isInputFocused && search.length > 0;

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            // Small delay to allow clicking on a profile
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Rechercher un profil..."
        />
        {shouldShowResults && (
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.full_name || ""}
                  onSelect={() => handleSelectProfile(profile)}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{profile.full_name}</span>
                    <span className="text-sm text-muted-foreground">{profile.role}</span>
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
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}