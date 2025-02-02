import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
}

export function ProfileSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Erreur lors de la recherche des profils");
        return [];
      }
      
      return data || [];
    },
    enabled: searchQuery.length > 0
  });

  const handleViewProfile = (userId: string) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un profil..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-11"
        />
        <CommandList>
          <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
          <CommandGroup>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Chargement des profils...
              </div>
            ) : (
              profiles.map((profile) => (
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
              ))
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}