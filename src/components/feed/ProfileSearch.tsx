import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Loader } from "@/components/ui/loader";

export function ProfileSearch() {
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

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
    if (!profile) return;
    setSelectedProfile(profile);
    setIsInputFocused(false);
  };

  const shouldShowResults = isInputFocused && search.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Rechercher un profil..."
            value={search}
            onValueChange={setSearch}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              // Small delay to allow clicking on a profile
              setTimeout(() => setIsInputFocused(false), 200);
            }}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {shouldShowResults && (
          <CommandList className="max-h-[300px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader className="h-6 w-6" />
              </div>
            ) : error ? (
              <CommandEmpty>Une erreur est survenue</CommandEmpty>
            ) : profiles.length === 0 ? (
              <CommandEmpty>Aucun profil trouvé</CommandEmpty>
            ) : (
              <CommandGroup>
                {profiles.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.full_name || ""}
                    onSelect={() => handleSelectProfile(profile)}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent rounded-md"
                  >
                    {profile.full_name || "Sans nom"}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
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