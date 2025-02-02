import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function ProfileSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`full_name.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`)
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      return data || [];
    },
    enabled: searchQuery.length > 0
  });

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un profil..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-9"
        />
        {searchQuery.length > 0 && (
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Chargement des profils...
              </div>
            ) : profiles && profiles.length > 0 ? (
              <CommandGroup>
                {profiles.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    className="flex items-center gap-2 p-2 cursor-pointer"
                    onSelect={() => handleViewProfile(profile.id)}
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span>{profile.full_name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}