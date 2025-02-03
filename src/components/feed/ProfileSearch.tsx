import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserRound } from "lucide-react";
import { useDebounce } from "use-debounce";

interface ProfileSearchProps {
  onSelect: (profile: UserProfile) => void;
  placeholder?: string;
  className?: string;
}

export function ProfileSearch({ onSelect, placeholder = "Rechercher...", className = "" }: ProfileSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", debouncedSearch],
    queryFn: async () => {
      try {
        if (!debouncedSearch || debouncedSearch.length < 2) return [];

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("full_name", `%${debouncedSearch}%`)
          .limit(5);

        if (error) {
          console.error("Error searching profiles:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in profile search:", error);
        return [];
      }
    },
    enabled: debouncedSearch.length >= 2,
  });

  const handleSearch = (value: string) => {
    try {
      setSearch(value);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  return (
    <Command className={`rounded-lg border shadow-md ${className}`}>
      <CommandInput 
        placeholder={placeholder}
        value={search}
        onValueChange={handleSearch}
      />
      {search.length >= 2 && (
        <CommandGroup>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : profiles.length === 0 ? (
            <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
          ) : (
            profiles.map((profile) => (
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
            ))
          )}
        </CommandGroup>
      )}
    </Command>
  );
}