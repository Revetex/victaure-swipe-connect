import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";

export function ProfileSearch() {
  const [search, setSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles", search],
    queryFn: async () => {
      if (!search) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${search}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return (data || []) as UserProfile[];
    },
    enabled: search.length > 0,
  });

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Rechercher un profil..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onValueChange={setSearch}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </div>
          {isInputFocused && search && (
            <CommandList className="max-h-[300px] overflow-y-auto p-2">
              <CommandEmpty>Aucun profil trouvé</CommandEmpty>
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
            </CommandList>
          )}
        </Command>
      </div>

      {selectedProfile && (
        <ProfilePreview 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </>
  );
}