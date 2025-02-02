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
import { toast } from "sonner";

export function ProfileSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: async () => {
      console.log("Searching for:", searchQuery);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,role.ilike.%${searchQuery}%`)
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Erreur lors de la recherche des profils");
        throw error;
      }

      console.log("Search results:", data);
      return data || [];
    },
    enabled: searchQuery.length > 0
  });

  const handleViewProfile = (userId: string) => {
    console.log("Navigating to profile:", userId);
    navigate(`/dashboard/profile/${userId}`);
  };

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Rechercher un profil..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          className="h-9"
        />
      </Command>
      
      {(isInputFocused || searchQuery) && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-950 rounded-lg border shadow-lg max-h-[300px] overflow-y-auto z-50">
          <CommandList>
            {searchQuery.length === 0 ? null : (
              <>
                <CommandEmpty>Aucun profil trouvé.</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Chargement des profils...
                    </div>
                  ) : (
                    profiles?.map((profile) => (
                      <CommandItem
                        key={profile.id}
                        value={`${profile.id}-${profile.full_name}`}
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-accent"
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
                        <div className="flex flex-col">
                          <span className="font-medium">{profile.full_name}</span>
                          <span className="text-sm text-muted-foreground">{profile.role}</span>
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </div>
      )}
    </div>
  );
}