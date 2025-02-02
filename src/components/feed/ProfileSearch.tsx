import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ProfilePreview } from "@/components/ProfilePreview";
import { UserRound, Briefcase, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 100);
          }}
          placeholder="Rechercher un profil..."
          className="h-12"
        />
        {search.length > 0 && (
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              Aucun résultat trouvé.
            </CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.full_name || ""}
                  onSelect={() => handleSelectProfile(profile)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                    <AvatarFallback>
                      <UserRound className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{profile.full_name}</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {profile.role && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span className="truncate">{profile.role}</span>
                        </div>
                      )}
                      {profile.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{profile.city}</span>
                        </div>
                      )}
                    </div>
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