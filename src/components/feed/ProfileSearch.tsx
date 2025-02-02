import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";

export function ProfileSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${searchTerm}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return data || [];
    },
    enabled: searchTerm.length > 0
  });

  const handleProfileSelect = (profileId: string) => {
    navigate(`/dashboard/profile/${profileId}`);
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Rechercher un profil..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        {searchTerm.trim() && (
          <>
            <CommandEmpty>Aucun profil trouvé</CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.id}
                  onSelect={() => handleProfileSelect(profile.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback>
                        <UserCircle2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}