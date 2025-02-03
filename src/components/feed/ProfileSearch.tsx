import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserRound } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ 
  onSelect,
  placeholder = "Rechercher un utilisateur...",
  className = ""
}: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .ilike("full_name", `%${debouncedSearch}%`)
        .limit(5);

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }

      return profiles as UserProfile[];
    },
    enabled: true,
    placeholderData: []
  });

  return (
    <div className="relative w-full">
      <Command className={`rounded-lg border shadow-md ${className}`}>
        <CommandInput 
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
        />
      </Command>
      {(isLoading || profiles.length > 0 || debouncedSearch) && (
        <div className="absolute w-full mt-1 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          <CommandList>
            <CommandGroup>
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!isLoading && debouncedSearch && profiles.length === 0 && (
                <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
              )}
              {!isLoading && profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  onSelect={() => onSelect(profile)}
                  onMouseEnter={() => setHoveredId(profile.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
                    hoveredId === profile.id ? 'bg-accent' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback>
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{profile.full_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      )}
    </div>
  );
}