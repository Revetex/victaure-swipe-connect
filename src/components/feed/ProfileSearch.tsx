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

        return (data || []) as UserProfile[];
      } catch (error) {
        console.error("Error in query:", error);
        return [];
      }
    },
    enabled: search.length > 0,
    initialData: [],
  });

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setSearch("");
    setIsInputFocused(false);
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="relative">
      <Command className="relative z-40 max-w-lg mx-auto">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            // Give time for the click event to register before closing
            requestAnimationFrame(() => setIsInputFocused(false));
          }}
          placeholder="Rechercher un profil..."
          className="w-full px-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isInputFocused && search.length > 0 && (
          <Command.List className="absolute w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden z-50">
            {profiles.map((profile) => (
              <Command.Item
                key={profile.id}
                value={profile.full_name || ''}
                onSelect={() => handleSelectProfile(profile)}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
              >
                {profile.full_name}
              </Command.Item>
            ))}
            {profiles.length === 0 && (
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <ProfilePreview 
            profile={selectedProfile} 
            onClose={handleCloseProfile}
          />
        </div>
      )}
    </div>
  );
}