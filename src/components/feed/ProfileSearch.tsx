import { useState } from "react";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";

export function ProfileSearch() {
  const [search, setSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      if (!search) return [];
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${search}%`)
          .limit(5);

        if (error) {
          console.error("Error fetching profiles:", error);
          return [];
        }

        return data as UserProfile[] || [];
      } catch (error) {
        console.error("Error in query:", error);
        return [];
      }
    },
    enabled: search.length > 0,
    initialData: [],
  });

  const handleSelectProfile = (profile: UserProfile) => {
    console.log("Selected profile:", profile);
    setSelectedProfile(profile);
    setSearch("");
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="relative z-50">
      <Command className="relative max-w-lg mx-auto">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          placeholder="Rechercher un profil..."
          className="w-full px-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isInputFocused && search.length > 0 && Array.isArray(profiles) && (
          <Command.List className="absolute w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <Command.Item
                  key={profile.id}
                  value={profile.full_name || ''}
                  onSelect={() => handleSelectProfile(profile)}
                  className="px-4 py-2 hover:bg-muted cursor-pointer"
                >
                  {profile.full_name}
                </Command.Item>
              ))
            ) : (
              <Command.Item
                value="no-results"
                className="px-4 py-2 text-muted-foreground"
                disabled
              >
                Aucun résultat
              </Command.Item>
            )}
          </Command.List>
        )}
      </Command>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
}