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

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];

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
    enabled: debouncedSearch.length >= 2,
    keepPreviousData: true
  });

  return (
    <Command className={`rounded-lg border shadow-md ${className}`}>
      <CommandInput 
        placeholder={placeholder}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandGroup>
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!isLoading && debouncedSearch.length >= 2 && profiles.length === 0 && (
            <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
          )}
          {!isLoading && profiles.map((profile) => (
            <CommandItem
              key={profile.id}
              onSelect={() => onSelect(profile)}
              className="flex items-center gap-2 p-2"
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
    </Command>
  );
}